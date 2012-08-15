define(["shooter/object", "shooter/constants"], function(Object, C){
    function Objects(){
        this.index = {}
        this.root = {s:0, level:0, x_min:0, x_mid:C.WORLD_SIZE/2, x_max:C.WORLD_SIZE, y_min:0, y_mid: C.WORLD_SIZE/2, y_max:C.WORLD_SIZE, childs:false, leaf_array:[]}
        this.index_counter = 0;
    }

    function split(node){
        node.childs = true;
        var child_array = node.child_array = [];
        
        for(var i=0; i<4; ++i){
            var child_node = {
                s:0,
                level: node.level+1,
                childs: false,
                leaf_array: [],
                parent: node
            };
            if (i==0 || i==2){
                child_node.x_min = node.x_min;
                child_node.x_max = node.x_mid;
            }else{
                child_node.x_min = node.x_mid;
                child_node.x_max = node.x_max;
            }
            if(i<2){
                child_node.y_min = node.y_min;
                child_node.y_max = node.y_mid;
            }else{
                child_node.y_min = node.y_mid;
                child_node.y_max = node.y_max;
            }
            child_node.x_mid = (child_node.x_min + child_node.x_max) /2;
            child_node.y_mid = (child_node.y_min + child_node.y_max) /2;
            child_array.push(child_node);
        }
        var leaf_array = node.leaf_array;
        for(var i=0, len = leaf_array.length; i<len; ++i){
            var o = leaf_array[i];
            var pos = o.pos;
            var child = child_array[0+(pos.x>node.x_mid?1:0)+(pos.y>node.y_mid?2:0)]
            child.leaf_array.push(o);
            ++child.s;            
        }
        delete node.leaf_array;
    }

    Objects.prototype.add = function(o){
        if(!this.index[o.id]){
            this.index[o.id] = o;
            var node = this.root;
            var pos = o.pos;
            while(node.childs){
                ++node.s
                node = node.child_array[0+(pos.x>node.x_mid?1:0)+(pos.y>node.y_mid?2:0)];
            }
            ++node.s
            node.leaf_array.push(o);
            if(node.s > C.QUADTREE_NODE_LIMIT && node.level <= C.QUADTREE_LEVEL_LIMIT){
                split(node);
            }
        }
    }
    
    Objects.prototype.remove = function(id){
        var o = this.index[id]
        if (o){
            delete this.index[id];
            var node = this.root;
            var pos = o.pos;
            while(node.childs){
                --node.s
                node = node.child_array[0+(pos.x>node.x_mid?1:0)+(pos.y>node.y_mid?2:0)];
            }
            --node.s
            var array = node.leaf_array
            for(var i=0, len = array.length; i<len; ++i){
                if(array[i] === o){
                    array.splice(i,1);
                    break;
                }
            }
            while(node.parent && node.parent.s <= C.QUADTREE_NODE_LIMIT){
                node = node.parent;
                var leaf_array = node.leaf_array = [];
                var child_array = node.child_array;
                for(var i=0; i<4; ++i){
                    var child_leafs = child_array[i].leaf_array;
                    for(var p=0, len=child_leafs.length; p<len; ++p){
                        left_array.push(child_leafs[p]);
                    }
                }
                delete node.child_array;
                node.childs = false;
            }
        }
    }

    Objects.prototype.get = function(id){
        return this.index[id];
    }

    Objects.prototype.next_id = function(){
        return ++this.index_counter;
    }

    return Objects;
});

