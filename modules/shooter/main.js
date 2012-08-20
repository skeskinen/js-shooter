define(["shooter/networking", "shooter/rendering", "shooter/maps", "shooter/game", "shooter/events"], function(networking, rendering, maps, game, events){
    events.bind();

    networking.connect();
 
  //  events.bind();

//    projectiles.generate();
});

/*
define(["shooter/networking", "shooter/maps", "shooter/events", "shooter/projectiles"], function(networking, maps, events, projectiles){

    networking.connect();

    maps.init();
    
    events.bind();

    projectiles.generate();
});
*/
