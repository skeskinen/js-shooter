define(["shooter/maps", "shooter/vector", "shooter/utils", "shooter/game", "shooter/constants"], function(maps, vector, utils, game, C) {
    var socket;
    return {
        connect: function(){
            socket = io.connect();
            var first_time_diff;
            function time_request(){
                socket.emit('time', {c_time:new Date().getTime()});
            }
            socket.on('connect', function(){
                
                for(var i = 0; i<20; i++){
                    setTimeout(time_request, i*5000);
                }
                socket.emit('auth', {guest:true});
                var tmp_start_pos = vector();
                socket.emit('spawn', tmp_start_pos);
            });

            socket.on('time', function(data){
                utils.new_time_result(data);
            });

            socket.on('events', function(data){
                for(var i=0, len = data.length; i < len; ++i){
                    game.add_event(data[i]);
                }
            });

            socket.on('player', function(id){
               game.player_id = id; 
            });
        },
        send_move: function(move){
            socket.emit('move', {time: utils.time() + C.EVENT_DELAY, move:move});
        }
    }
});

