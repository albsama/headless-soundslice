const Browser = require( 'zombie' ),
      browser = new Browser();

var querystring = require('querystring');

function soundslice( email, password ) {
  console.log( 'soundslice: init/auth' );

  var self = this;

  this.authenticated = false;
  this.readyEvent = function() {};

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
};

soundslice.prototype.uploadNotation = function( options ) {
  console.log( 'soundslice: uploadNotation', options );
  browser.visit( 'https://www.soundslice.com/manage/create-score/', function() {
    console.log( 'soundslice: entering details' );
    browser.fill( 'name', options.name )
           .fill( 'artist', options.artist )
           .pressButton( 'Save', function() {
             console.log( 'soundslice: details saved (step 1 of 2)' );
             var lookupUrl = 'https://www.soundslice.com/manage/?' + querystring.stringify( { q: options.name + ' ' + options.artist } );
             console.log( lookupUrl );
             browser.visit( lookupUrl, function() {
             });
           });
  });
};

soundslice.prototype.ready = function( f ) {
  this.readyEvent = f;
};

module.exports = soundslice;
