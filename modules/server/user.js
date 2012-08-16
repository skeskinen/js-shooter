define(["server/server_game", "shooter/objects", "shooter/object", "shooter/constants", "server/listeners"], function(server_game, objects, object, C, listeners){
    var User = function(o){
        for (i in o) {
            this[i] = o[i];
        }
    }

    User.prototype.object = function(){
        if (this._object){
            return this._object;
        }
        this._object = objects.get(this.object_id);
        return this._object;
    }

    User.prototype.spawn = function(pos){
        this.object_id = server_game.user_spawn(pos);
        this.listener = listeners.add_listener({pos: pos, socket: this.socket});
        return this.object_id;
//        listeners.add_event({time: new Date().getTime() + C.EVENT_DELAY
    }

    return User;
});

