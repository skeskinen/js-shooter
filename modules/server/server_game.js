define(["shooter/constants", "shooter/game", "server/listeners", "shooter/objects"], function(C, game, listeners, objects){
    var id_count = 0;
    function next_id(){
        return ++id_count;
    }
    return {
        user_spawn: function(pos){
            var id = next_id();
            var o = {type: C.TYPE_HUMAN, pos: pos, id: id};
            var e = {type: C.EVENT_SPAWN, data:o, time: new Date().getTime() + C.EVENT_DELAY};
            game.add_event(e);
            listeners.add_event({pos: pos, data:e});

            return id;
        },
        add_event: function(e){
            game.add_event(e);
            var object = objects.get(e.id);
            listeners.add_event({pos: object.pos, data:e});
        }
    }
});
