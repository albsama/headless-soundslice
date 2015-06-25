var soundslice = require('./');
var Soundslice = new soundslice( 'matias@insaurral.de', 'prueba123');

console.log( '* Test program' );

var checkAuthInterval = setInterval( function() {

  if( Soundslice.authenticated == false ) {
    console.log( '* isAuthenticated? (async auth)', Soundslice.authenticated );
  } else {
    clearInterval( this );
  };

}, 2000 );

Soundslice.ready( function() {

  console.log( '* ready (callback)!' );
  console.log( '* trying to upload a notation' );

  Soundslice.uploadNotation({
    name: 'notation uploaded from node!',
    artist: 'eric clapton',
    filePath: 'sample.gp4'

  }, function( notationId ) {

    console.log( '' );
    console.log( '* finishCallback! got notation id #', notationId );
    console.log( '' );

    Soundslice.embed( notationId, 640, 480, function( html ) {
      console.log( '* HTML/Embed code:', html );
      process.exit();
    });

  });
});
