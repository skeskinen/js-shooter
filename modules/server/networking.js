define(["shooter/vector", "server/user", "server/users", "shooter/game", "server/listeners", "shooter/constants"], function(vector, User, users, game, listeners, C){
    return {
        listen: function(io){
            io.sockets.on('connection', function(socket){
            var user;
            socket.emit('ready',{});
                socket.on('auth', function(data){
                    var connected_user;
                    if (data.guest){
                        user = new User({name:'guest'+users.next_guest_id(), socket: socket})
                    }else{
                        //do auth stuff
                    }
                    
                    users.add(connected_user);
                });

                socket.on('spawn', function(pos){
                    user.spawn(vector(pos));
                });

                socket.on('event', function(data){
                    var e = {pos: user.object.pos, data: data, time: new Date().getTime() + C.EVENT_DELAY};
                    listeners.add_event(e);
                    game.add_event(e);
                });
            });
        },
    }
});

