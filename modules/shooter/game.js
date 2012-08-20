/*
 *  Game logic that is visible to the client.
 *  Mainly event handler. Doesn't do stuff on it's own.
 */

define(["shooter/object","shooter/objects", "shooter/utils", "shooter/constants", "shooter/vector"], function(Game_object, objects, utils, C, vector){

    var player_id = 0;

    /*
    * Executes given event immediately and returns result. 
    */

    function event(e){
        switch(e[0]){
            case C.EVENT_SPAWN:
                return _event_spawn(e);
            break;
            case C.EVENT_MOVE:
                return _event_move(e);
            break;
        }
    }

    /*
     *  Spawns new object into the game.
     */

    function _event_spawn(e){
        var id = e[2], pos = vector(e[3], e[4]), type = e[5];
        if(id === player_id){
            type = C.TYPE_PLAYER;
        }
        var object = new Game_object(id, pos, type);
        return object;
    }

    /*
     *  Event for setting object movement direction.
     */

    function _event_move(e){
        var id = e[2], dir = vector(e[3], e[4]);
        var object = objects.get(id);
        object.modules[C.ROLE_MOVE].set_move(dir);
    }

    /*
     *  Used to tell game which object the player is controlling. 
     *  If object already exists, the type is changed.
     */

    function set_player(id) {
        player_id = id;
        var object = objects.get(id);
        if(object){
            object.change_type(C.TYPE_PLAYER);
        }
    }

    return {
        event:event,
        set_player: set_player
    }

});

