define(["shooter/constants", "shooter/utils"], function(C, utils){
    /*
     *  Quadtree node constructor. This class is not visible outside this module.
     *  Quadtree is used to store objects in a way that we can easily what all
     *  objects in certain area.
     */
    function Node(x, y, s, level){
        this.x = x;
        this.y = y;
        this.s = s;
        this.level = level;
        this.area = [x, y, x+s, y+s];
        this.is_splitted = false;
        this.count = 0;
        this.array = [];
    }

    /*
     *  Quadrtree split. 
     */

    Node.prototype.split = function(){
        this.is_splitted = true;
        var x = this.x, y = this.y, s = this.s, level = this.level;
        
        var leafs = this.array;
        var array = this.array = [];

        for(var x_i = 0; x_i<2; ++x_i){
            for(var y_i = 0; y_i<2; ++y_i){
                var new_node = new Node(x + s*x_i/2, y + s*y_i/2, s/2, level+1);
                array.push(new_node);
                for(var i=0, len = leafs.length; i<len; ++i){
                    console.log('index', i);
                }
            }
        }
    }

    /*
     *  Function that adds new object to quadtree.
     *  If node has too many leafs it is split into 4 smaller nodes unless node 
     *  is too deep in the tree.
     */

    Node.prototype.add = function(object){
        if(utils.inside(this.area, object.pos)){
            ++this.count;
            var array = this.array;
            if(this.is_splitted){
                for(var i=0; i<4; ++i){
                    array[i].add(object);
                }
            }else{
                array.push(object);
                object.objects_area = this.area;
                if(this.count > C.OBJECTS_LEAF_LIMIT && this.level < C.OBJECTS_LEVEL_LIMIT){
                    this.split();
                }
            }
        }
    }

    /*
     *  Function that removes object from quadtree.
     *  If there is too few objects left in subtree frow which object was removed,
     *  it is shrinked.
     */

    Node.prototype.remove = function(object){
        if(utils.inside(this.area, object.pos)){
            --this.count;
            var array = this.array;
            if(this.is_splitted){
                for(var i=0; i<4; ++i){
                    array[i].remove(object);
                }
                if(this.level !== 0 && this.count < C.OBJECTS_LEAF_LIMIT /4){
                    this.shrink();
                }
            }else{
                var length_before = this.array.length;
                this.array = utils.without(this.array, object);
                if(this.array.length === length_before){
                    console.log("Could not remove object from quadtree. Need to do remove before update.");
                }
            }
        }
    }
    
    /*
     *  Combines lower level nodes into this node.
     *  Called if there is too few leafs in this subtree.
     */

    Node.prototype.shrink = function(){
        this.is_splitted = false;
        var childs = this.array;
        var array = this.array = [];
        for(var i=0; i<4; ++i){
            var childs_nodes = childs[i].array;
            for(var p=0, len = childs_nodes.length; p<len; ++p){
                array.push(childs_nodes[p]);
            }
        }
    }
    
    /*
     *  Calls function f for every object in area.
     */

    Node.prototype.area_get = function(area, f){
        if(utils.overlap(this.area, area)){
            var array = this.array;
            if(this.is_splitted){
                for(var i=0; i<4; ++i){
                    array[i].area_get(area, f);
                }
            }else{
                for(var i=0, len=array.length; i<len; ++i){
                    if(utils.inside(this.area, array[i].pos)){
                        f(array[i]);
                    }
                }
            }
        }
    }
    
    var root = new Node(0,0, C.WORLD_SIZE, 0);
    var index = {};

    /*
     *  Adds object to index and quadtree.  
     */

    function add_object(object){
        index[object.id] = object;
        root.add(object);
    };

    /*
     *  Remove object by id. Removes from index and quadtree.
     */

    function remove(id){
        var object = index[id];
        delete index[id];
        root.remove(object);
    }
    
    /*
     *  Remove object by object reference. Removes from index and quadtree.
     */

    function remove_object(object){
        delete index[object.id];
        root.remove(object);
    }

    /*
     *  Add object to quadtree. Useful when moving object.
     */

    function tree_add(object){
        root.add(object);
    }

    /*
     *  Remove object from quadtree. Useful when moving object.
     */

    function tree_remove(object){
        root.remove(object);
    }

    /*
     *  Returns object with given id from the object hash table.
     */

    function get(id){
        return index[id];
    }
    
    /*
     *  Calls function f for every object in area.
     */

    function area_get(area, f){
        root.area_get(area,f);
    }

    var id_counter = 0;

    /*
     *  Returns next free object id. This will be called from the place 
     *  that creates the event that will create the object.
     *  The event has to know the id so that it can be transmitted to clients.
     */

    function next_id(){
        return ++id_counter;
    }

    return {
        add_object: add_object,
        remove: remove,
        remove_object: remove_object,
        tree_add: tree_add,
        tree_remove: tree_remove,
        get: get,
        area_get: area_get,
        next_id: next_id
    }

});

