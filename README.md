li-connect
==========

Linkedin Connect


 LIConnect.init(function() {
  LIConnect.authorize(function() {
   LIConnect.fetchConnections(function(me, conns) {
      //Logic
   });
  });
 });
