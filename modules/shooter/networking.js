define(["shooter/maps", "shooter/vector"], function(maps, vector) {
    var socket;
    return {
        connect: function(){
            socket = io.connect();
            
            socket.on('ready', function(){
            socket.emit('auth', {guest:true});
            var tmp_start_pos = vector({x: 145.73387946666668, y: 74.09939904641982});
            socket.emit('spawn', tmp_start_pos);
            
            });

            socket.on('events', function(data){
                console.log(data); 
            });
        },
        send_move: function(move){
            console.log('send');
            socket.emit('event', move);
        }
        /*
        socket.on('spawn', function(data){
        spawn(data);
        });

        socket.on('remove', function(id){
        remove(id);
        });

        socket.on('update', function(data){
        _(data).each(function(object){
        var o = get_object(object.id);
        o.location_ = new google.maps.LatLng(object.loc.lat, object.loc.lng);
        });
        map.setCenter(player.location_);
        hidden_map.setCenter(player.location_);
        });

        socket.on('shot', function(data){
        var shooter = get_object(data.shooter);
        if (shooter !== undefined){
        spawn_bullet(shooter.location_, data.angle);
        }
        });

        },

        send_mouse: function(loc, angle){
        socket.emit('angle', {loc: loc, angle: angle});
        },

        send_move_dir:function(dir){
        socket.emit('move_dir', dir);
        }
        */
    }
});

