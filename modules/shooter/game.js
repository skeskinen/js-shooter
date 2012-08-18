/*
 *  Game logic that is visible to the client.
 *  Mainly event handler. Doesn't do stuff on it's own.
 */

define(["shooter/object","shooter/objects", "shooter/utils", "shooter/constants", "shooter/vector"], function(Game_object, objects, utils, C, vector){

    /*
    * Executes given event immediately and returns result. 
    */

    function event(e){
        switch(e[0]){
            case C.EVENT_SPAWN:
                return _event_spawn(e);
            break;
        }
    }

    /*
     *  Spawns new object into the game.
     */

    function _event_spawn(e){
        var id = e[2], pos = vector(e[3], e[4]), type = e[5];
        var object = new Game_object(id, pos, type);
        return object;
    }

    return {
        event:event
    }
});

