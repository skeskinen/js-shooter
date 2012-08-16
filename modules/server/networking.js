define(["shooter/vector", "server/user", "server/users", "server/server_game", "server/listeners", "shooter/constants"], function(vector, User, users, server_game, listeners, C){
    return {
        listen: function(io){
            io.sockets.on('connection', function(socket){
                socket.on('time', function(data){
                    data.s_time = new Date().getTime();
                    socket.emit('time', data);
                });
                
                socket.on('auth', function(data){
                    var user;
                    if (data.guest){
                        user = new User({name:'guest'+users.next_guest_id(), socket: socket})
                    }else{
                        //do auth stuff
                        return;
                    }

                    users.add(user);

                    socket.on('spawn', function(pos){
                        var id = user.spawn(vector(pos));
                        socket.emit('player', id);
                    });

                    socket.on('move', function(data){
                        var time = Math.min(C.EVENT_DELAY, Math.max(C.EVENT_DELAY_LOW_LIMIT, data.time));
                        var data = {move: data.move};
                        var id = user.object_id;
                        var e = {id: id, type:C.EVENT_MOVE, data: data, time:time};
                        server_game.add_event(e);
                    });
                });

            });
        },
    }
});

