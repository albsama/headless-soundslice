const Browser = require( 'zombie' ),
      browser = new Browser();

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

soundslice.prototype.uploadNotation = function() {
  console.log( 'soundslice: uploadNotation' );
};

soundslice.prototype.ready = function( f ) {
  this.readyEvent = f;
};

module.exports = soundslice;
