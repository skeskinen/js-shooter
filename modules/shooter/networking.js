define(["shooter/maps", "shooter/vector"], function(maps, vector) {
    return {
        connect: function(){
            socket = io.connect();
            socket.on('spawn_player', function(data){
                //        var latlng = rad;
//                var loc = Coord(data.loc.lat, data.loc.lng);
            //    maps.set_center(loc);
            });
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

