define(["shooter/maps", "shooter/vector", "shooter/utils", "shooter/game", "shooter/constants"], function(maps, vector, utils, game, C) {
    var socket;
    return {
        connect: function(){
            socket = io.connect();
            var first_time_diff;
            function time_request(){
                socket.emit('time', {c_time:Date.now()});
            }
            socket.on('connect', function(){
                
                for(var i = 0; i<20; i++){
                    setTimeout(time_request, i*5000);
                }
                socket.emit('auth', {guest:true});
                var tmp_start_pos = vector(38203262, 19424896);
                socket.emit('spawn', tmp_start_pos);
            });

            socket.on('time', function(data){
                utils.new_time_result(data);
            });

            socket.on('event', function(data){
                function execute_event(){
                    game.event(data);
                }
                setTimeout(execute_event, data[1] - utils.time());
            });

            socket.on('player', function(id){
               game.set_player(id); 
            });
        },
        send_move: function(move){
            socket.emit('move', [utils.time() + C.EVENT_DELAY, move.x, move.y]);
        }
    }
});

