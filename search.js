var soundslice = require('./');
var Soundslice = new soundslice( 'info@gurudelaguitarra.com', 'guru.de.la.guitarra' );

console.log( '* Test program' );

Soundslice.ready( function() {

  console.log( '* ready (callback)!' );
  console.log( '* sync' );

  /*Soundslice.search( 'dulo 25', function( results ) {
    console.log( 'search results!', results );
  });*/

  Soundslice.sync( null, function() {
    
  });

});
