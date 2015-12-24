const Browser = require( 'zombie' ),
      browser = new Browser();

var querystring = require('querystring'),
    ejs = require('ejs'),
    cheerio = require( 'cheerio' ),
    fs = require( 'fs' ),
    async = require( 'async' );

function soundslice( email, password ) {
  console.log( 'soundslice: init/auth' );

  var self = this;

  this.authenticated = false;
  this.readyEvent = function() {};
  this.scores = {};

  browser.visit( 'https://www.soundslice.com/login/', function() {
    browser.fill( 'email', email )
    .fill( 'password', password )
    .pressButton( 'Log in', function() {
      if( browser.text( 'title' ).indexOf( 'Log in' ) == -1 ) {
        console.log( 'soundslice: auth ok' );
        self.authenticated = true;
        self.readyEvent();
      } else {
        console.log( 'soundslice: auth error' );
      };
    })
  });

  this.sync = function( next, callback ) {

    var self = this;

    if( fs.existsSync( 'cache.json') ) {
      self.scores =  JSON.parse( fs.readFileSync( 'cache.json' ).toString() );
      callback(self.scores);
    } else {
      var results = [],
      scoresUrl = 'https://www.soundslice.com/manage/?start=';
      if( next ) {
        scoresUrl = scoresUrl + next;
      };

      browser.visit( scoresUrl, function() {

        var $ = cheerio.load( browser.resources[0].response.body ),
        scoreElements = $( '.score-listing' );

        async.each( scoreElements, function( e, callback ) {

          var score = {},
          score_id;

          score.anchor = $( $(e).find( '.score-actions li a' )[0] );
          score.href = score.anchor.attr( 'href' ).replace( '/manage/', '/scores/' );
          score.title = $(e).find('.score-title').find('strong').text();

          score_id = score.href.split( '/' )[2];

          delete( score.anchor );

          console.log( self.scores );

          self.scores[ score_id ] = score;

          callback();

        }, function() {
          if( $( '.searchnav' ).text().indexOf( 'Next' ) > -1 ) {

            var nextParam = $( '.searchnav a.pull-right').attr( 'href' ).split( 'start=' )[1];
            console.log( 'ir al siguiente!', 'nextparam es', nextParam);
            self.sync( nextParam, callback );
          } else {
            fs.writeFileSync( 'cache.json', JSON.stringify( self.scores ) );
            callback( self.scores );
          };
        });
      });
    };
  };
};

soundslice.prototype.embed = function( notationId, width, height, callback ) {
  var embedTemplate = '<iframe src="https://www.soundslice.com/scores/<%= id %>/" width="<%= width %>" height="<%= height %>" frameBorder="0" allowfullscreen></iframe>';
  callback( ejs.render( embedTemplate, { id: notationId, width: width, height: height} ) );
};

soundslice.prototype.getNotationId = function( url ) {
  var r = /manage\/(.*)\/notation/,
      matches  = url.match( r );
  if( matches == null ) {
    return -1;
  } else {
    return parseInt( matches[1] );
  };
};

soundslice.prototype.uploadNotation = function( options, finishCallback ) {

  var self = this;

  console.log( 'soundslice: uploadNotation', options );

  browser.visit( 'https://www.soundslice.com/manage/create-score/', function() {
    console.log( 'soundslice: entering details' );

    browser.fill( 'name', options.name )
    .fill( 'artist', options.artist )
    .pressButton( 'Save', function() {

      console.log( 'soundslice: details saved (step 1 of 2)' );

      var lookupUrl = 'https://www.soundslice.com/manage/?' + querystring.stringify( { q: options.name + ' ' + options.artist } );
      browser.visit( lookupUrl, function() {

        browser.clickLink( 'Upload notation', function() {

          console.log( 'soundslice: starting upload (step 2 of 2)' );

          options.notationId = self.getNotationId( browser.location.href );

          browser.attach( 'score', 'sample.gp4' );
          browser.pressButton( 'Start the upload', function( err ) {

            console.log( 'soundslice: upload ok (step 2 of 2)' );
            finishCallback(options.notationId);
          });
        });
      });
    });
  });
};

soundslice.prototype.ready = function( f ) {
  this.readyEvent = f;
};

module.exports = soundslice;
