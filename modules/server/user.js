define(["shooter/game", "shooter/object", "shooter/constants", "server/listeners"], function(game, object, C, listeners){
    var User = function(o){
        for (i in o) {
            this[i] = o[i];
        }
    }

    User.prototype.spawn = function(pos){
        this.object = game.spawn({pos: pos, type: C.TYPE_HUMAN});
        this.listener = listeners.add_listener({pos: pos, socket: this.socket});

    }

    return User;
});

