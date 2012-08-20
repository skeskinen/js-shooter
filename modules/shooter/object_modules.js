/*
 *  Modules give functionality to objects.
 *  All modules are defined here and shooter/object gets them here.
 */

define(["shooter/constants", "shooter/vector", "shooter/utils", "shooter/objects"], function(C, vector, utils, objects){
   
    var server_modules = {}
    server_modules[C.TYPE_HUMAN] = [[C.ROLE_MOVE, 'move']];
    
    var client_modules = {};
    client_modules[C.TYPE_HUMAN] = [[C.ROLE_MOVE, 'move'], [C.ROLE_DRAW,'draw']];
    client_modules[C.TYPE_PLAYER] = [[C.ROLE_MOVE, 'move'], [C.ROLE_DRAW,'draw']];

    /*
     * Return list of default modules.
     */

    function default_modules(type){
        if (typeof window !== undefined){
            return client_modules[type];
        }else{
            return server_modules[type];
        }
    }

    /*
     *  Note that module "constructor" execution context is that of calling objects.
     *  this == Game_object
     */


    /*
     *  Generic move module
     */

    function move(){
        function Move(object){
            this.object = object;
            this.dir = vector();
            this.speed = 80 /1000;
            this.last_update = 0;
            this.scheduled_update_set = false;
            this.scheduled_update_handle = 0;
        }
        
        /*
         *  Calculates time since last update and moves object.
         *  Sets last_update for future updates.
         */

        Move.prototype.update = function(){
            var cur_time = utils.time();
            var dir = this.dir;
            if((dir.x !== 0) || (dir.y !== 0)){
                var dt = cur_time - this.last_update;
                var move_distance = this.speed * dt;
                var pos = this.object.pos;
                this.object.pos = vector(Math.floor(pos.x + dir.x * move_distance), 
                    Math.floor(pos.y + dir.y * move_distance));
            }
            this.last_update = cur_time;
        }

        /*
         *  Function to set movement direction.
         *  First does update incase object was already moving and to set last_update.
         *  Finally sets scheduled update. If movement = 0 there will be no scheduled update.
         */

        Move.prototype.set_move = function(dir){
            this.update();
            this.dir = dir;
            this.set_scheduled_update();
        }
        
        /*
         * Scheduled update happens when object needs to be moved in shooter/objects quadtree.
         * Objects have variable objects_area that contains the bounds of current quadtree
         * node. This info can be used to calculate when update should be fired.
         */

        Move.prototype.set_scheduled_update = function(){
            if(this.scheduled_update_set){
                clearTimeout(this.scheduled_update_handle);
                this.scheduled_update_set = false;
            }
            var dir = this.dir
            if((dir.x === 0) && (dir.y === 0)){
                return;
            }
            var time = 9999999999;
            var area = this.object.objects_area;
            var pos = this.object.pos;
            var speed = this.speed;
          
            if(dir.x < 0){
                time = Math.min(time, Math.ceil((pos.x - area[0])/speed));
            }
            if(dir.x > 0){
                time = Math.min(time, Math.ceil((area[2] - pos.x)/speed));
            }
            if(dir.y < 0){
                time = Math.min(time, Math.ceil((pos.y - area[1])/speed));
            }
            if(dir.y > 0){
                time = Math.min(time, Math.ceil((area[3] - pos.y)/speed));
            }

            this.scheduled_update_handle = setTimeout(this.scheduled_update.bind(this), time);
            this.scheduled_update.set = true;
        }

        /*
         * Move object into different shooter/objects quadtree node.
         * Set up new scheduled update.
         */

        Move.prototype.scheduled_update = function(){
            objects.tree_remove(this.object);
            this.update();
            objects.tree_add(this.object);
            this.set_scheduled_update();
        }

        return new Move(this);
    }

    /*
     *  Generic draw module
     */

    function draw(){
        var me = this;
        return function draw(context){
            if(me.roles[C.ROLE_MOVE]){
                me.modules[C.ROLE_MOVE].update();
            }
            if(me.type == C.TYPE_PLAYER){
                context.fillStyle = 'blue';
            }else{
                context.fillStyle = 'black';
            }
            context.fillRect(me.pos.x-10, me.pos.y-10, 20, 20);
        }
    }

    return {
        default_modules: default_modules,
        move: move,
        draw: draw
    }
});
