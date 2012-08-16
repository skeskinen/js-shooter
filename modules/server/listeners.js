define(["shooter/constants", "shooter/vector", "server/listener", "dojo/_base/array"], function(C, vector, Listener, arrayUtil) {
    var index_counter = 0;
    var listeners = [];
    var events = [];
    var total_parts = 1000;
    var part_size = 1000;
    var total_size = total_parts * part_size;
    var tile_size = C.WORLD_SIZE * (2 / total_size);

    var last_process = 0;

    for(var i=0; i<total_parts; ++i){
        events.push(Array(total_parts));
    }

    function closest_tile(pos){
        var x2 = pos.x / tile_size * 2;
        var x1 = Math.floor(x2/part_size);
        x2 = Math.floor(x2%part_size);
        var y2 = pos.y / tile_size * 2;
        var y1 = Math.floor(y2/part_size);
        y2 = Math.floor(y2%part_size);
        return {x1: x1, x2: x2, y1: y1, y2: y2};
    }
    function lower_bound(pos){
        var x2 = (pos.x - 0.25 * tile_size) / tile_size * 2 - 0.25 * tile_size;
        var x1 = Math.floor(x2/part_size);
        x2 = Math.floor(x2%part_size);
        var y2 = (pos.y - 0.25 * tile_size) / tile_size * 2;
        var y1 = Math.floor(y2/part_size);
        y2 = Math.floor(y2%part_size);
        return {x1: x1, x2: x2, y1: y1, y2: y2};
    }
    function ensure(x1, y1, x2, y2){
    var table = events[x1];
        if(typeof table[y1] !== 'object'){
            table[y1] = new Array(part_size);
        }
        table = table[y1];
        if(typeof table[x2] !== 'object'){
            table[x2] = new Array(part_size);
        }
        table = table[x2];
        if(typeof table[y2] !== 'object'){
            table[y2] = {}
        }
        return table[y2];
    }

    function exists(x1, y1, x2, y2){
        var table = events[x1][y1];
        if(typeof table === 'object'){
            table = table[x2]
            if(typeof table === 'object'){
                return table[y2];
            }
        }
        return undefined;
    }

    function tile_to_pos(x1, y1, x2, y2){
        return vector({x: (x1*part_size+x2)*tile_size, y:(y1*part_size+y2)*tile_size});
    }

    return {
        add_event: function(e){
            var bound = lower_bound(e.pos);
            for(var x=0; x<2; ++x){
                for(var y=0; y<2; ++y){
                    var x1 = bound.x1, y1= bound.y1, x2=bound.x2+x,y2=bound.y2 +y;
                    if (x2 >= part_size){
                        ++x1;
                        x2 -= part_size;
                    }
                    if (y2 >= part_size){
                        ++y1;
                        y2-= part_size;
                    }
                    event_tile = ensure(x1, y1, x2, y2);
                    if(!event_tile.update_time || event_tile.update_time < last_process){
                        event_tile.events = [];
                        event_tile.update_time = new Date().getTime();
                    }
                    event_tile.events.push(e.data);
                }
            }
        },
        process_events: function(){
            for(var i=0, len = listeners.length; i<len; ++i){
                var listener = listeners[i];
                var tile = listener.tile;

                var event_tile = exists(tile.x1,tile.y1,tile.x2,tile.y2);
                if(event_tile && event_tile.update_time >= last_process){
                    listener.socket.emit('events', event_tile.events);
                }
            }
            last_process = new Date().getTime();
        },
        add_listener: function(o){
            var listener = {pos: o.pos, socket: o.socket};
            listener.id = ++index_counter;
            listener.tile = closest_tile(listener.pos);
            listeners.push(listener);
            return listener;
        },
        move_listener: function(listener, pos){
            listener.pos = pos;
            var old_d = tile_to_pos(listener.tile).sub(pos);
            if(Math.abs(old_d.x) > tile_size *0.25 || Math.abs(old_d.y) > tile_size * 0.25){
                listener.tile = closest_tile(pos);
            }
        },
        remove_listener: function(listener){
            listeners = arrayUtil.filter(listeners, function(v){
                return v !== listener;
            });
        }
    }
});

