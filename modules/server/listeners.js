/*
 *  Container class for all listeners. Used to determine who wants to hear which event.
 *  Works like quadtree until deepest level. Deepest level is 4x4 instead of 2x2 and nodes overlap.
 */

define(["shooter/constants", "shooter/vector", "dojo/_base/array", "shooter/utils"], function(C, vector, arrayUtil, utils) {
    /*
    *  Create new tree node.
    *  Because of overlapping deepest level, have to add (size at deepest level /4) 
    *  to every area before that.
    *  This class is not visible outside this module.
    */
    function Node(x, y, s, level){
        this.x = x;
        this.y = y;
        this.s = s;
        this.level = level;
        this.area = [x, y, x+s, y+s];
        if(level < C.LISTENERS_LEVEL_LIMIT){
            this.area[2] += C.LISTENERS_TILE_SIZE/4;
            this.area[3] += C.LISTENERS_TILE_SIZE/4;
        }
        this.is_splitted = false;
        this.array = [];
    }

    /*
    *  Split the node. 2x2 grid until deepest level.
    *  4x4 at the bottom. Size stays previous level /2 but 
    *  coordinates are previous level /4 so nodes overlap.
    */

    Node.prototype.split = function(){
        this.is_splitted = true;
        var x = this.x, y = this.y, s = this.s, level = this.level;

        var grid_s = 2;
        if(level === C.LISTENERS_LEVEL_LIMIT-1){
            grid_s = 4;
        }
        var array = this.array;
        for(var x_i = 0; x_i<grid_s; ++x_i){
            for(var y_i = 0; y_i<grid_s; ++y_i){
                array.push(new Node(x+s-s*(grid_s-x_i)/grid_s, y+s-s*(grid_s-y_i)/grid_s, s/2, level+1));
            }
        }
    }

    /*
    *  Gets listeners at event pos and send event to those. 
    *  This doesn't have to split. If there is no split then there is no listeners in area.
    */

    Node.prototype.send_event = function(e){
        if (utils.inside(this.area, e.pos)){
            if(this.level === C.LISTENERS_LEVEL_LIMIT){
                var array = this.array;
                for(var i=0, len = array.length; i<len; i++){
                    array[i].socket.send_event(e);
                }
            }else{
                if(this.is_splitted){
                    var array = this.array;
                    for(var i=0, len = array.length; i<len; ++i){
                        array[i].send_event(e);
                    }
                }
            }
        }
    }

    /*
    *  Gets the closest tile to pos at the deepest level. 
    *  Splits if have to.
    */

    Node.prototype.closest_tile = function(pos){
        if (this.level === C.LISTENERS_LEVEL_LIMIT){
            var x = this.x, y = this.y, s = this.s;
            var area = [x+s/4, y+s/4, x+s/4*3, y+s/4*3];
            if (x===0){
                area[0] = 0;
            }
            if (y===0){
                area[1] = 0;
            }
            if(utils.inside(area, pos)){
                return this;
            }else{
                return false;
            }
        } else if (utils.inside(this.area, pos)){
            if(!this.is_splitted){
                this.split()
            }
            var array = this.array;
            for(var i=0, len = array.length; i<len; ++i){
                var ret = array[i].closest_tile(pos);
                if(ret){
                    return ret;
                }
            }
        }
        return false;
    }

    var root = new Node(0,0, C.WORLD_SIZE, 0);

    var tile_size = C.LISTENERS_TILE_SIZE;

    /*
    *  Send event to correct listeners.
    *  Forwards event to root node.
    */

    function send_event(e){
        root.send_event(e);
    }

    /*
    *  Get best maching tile for listener and add listener to that tile.
    *  Set listener tile area so that listener knows when it should switch to next tile.
    */

    function add_listener(listener){
        var tile = root.closest_tile(listener.pos);
        tile.array.push(listener);

        var x = tile.x, y = tile.y, s = tile.s;
        var area = [Math.floor(x+s/5), Math.floor(y+s/5), Math.floor(x+s/5*4), Math.floor(y+s/5*4)];
        listener.tile_area = area;
    }

    /*
    *  Get best matching tile for listener and remove listener from that tile.
    *  Note that you can't update listener position before this has been called.
    */

    function remove_listener(listener){
        var tile = root.closest_tile(listener.pos);
        tile.array = utils.without(tile.array, listener);
    }

    return {
        send_event: send_event,
        add_listener: add_listener,
        remove_listener: remove_listener
    }
});

