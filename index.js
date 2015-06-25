const Browser = require( 'zombie' );

const browser = new Browser();

browser.visit( 'https://www.soundslice.com/login/', function() {
  console.log( 'get login page', browser.text( 'title' ) );
  browser.fill( 'email', 'matias@insaurral.de' )
         .fill( 'password', 'prueba12' )
         .pressButton( 'Log in', function() {
           console.log( 'presionar boton!', browser.text( 'title' ) );
         })
  console.log( 'post fill', browser.text( 'title' ) );
} );
