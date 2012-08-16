define(["shooter/networking", "shooter/drawing", "shooter/maps", "shooter/game", "shooter/events"], function(networking, drawing, maps, game, events){
    events.bind();

    networking.connect();
 
    function draw(){
        drawing.render();
        setTimeout(draw, 50);
    }
    draw();

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
