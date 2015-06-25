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
  });
});
