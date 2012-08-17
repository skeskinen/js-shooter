define(["shooter/object", "shooter/constants", "shooter/utils"], function(object, C, utils){
    index = {}
    root = {s:0, level:0, x_min:0, x_mid:C.WORLD_SIZE/2, x_max:C.WORLD_SIZE, y_min:0, y_mid: C.WORLD_SIZE/2, y_max:C.WORLD_SIZE, childs:false, leaf_array:[]}

    function _split(node){
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
    
    function add(o){
        o = object(o);
        index[o.id] = o;

        var node = root;
        var pos = o.pos;
        while(node.childs){
            ++node.s
            node = node.child_array[0+(pos.x>node.x_mid?1:0)+(pos.y>node.y_mid?2:0)];
        }
        ++node.s
        node.leaf_array.push(o);
        if(node.s > C.OBJECTS_LEAF_LIMIT && node.level <= C.OBJECTS_LEVEL_LIMIT){
            _split(node);
        }
        return o;
    }
    
    function remove(id){
        var o = index[id]
        if (o){
            delete index[id];
            var node = root;
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
            while(node.parent && node.parent.s <= C.OBJECTS_LEAF_LIMIT){
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

    function get(id){
        return index[id];
    }

    var overlap = utils.overlap;

    function _get_objects(node, area, f){
        if (overlap(area, {x1: node.x_min, y1: node.y_min, x2: node.x_max, y2: node.y_max})){
            if (node.childs){
                for(var i=0; i<4; i++){
                    get_objects(node.child_array[i], area, f);
                }
            }else{
                var leaf_array = node.leaf_array
                for(var i=0, len = leaf_array.length; i<len; ++i){
                    var x1 = area.x1, y1 = area.y1, x2 = area.x2, y2 = area.y2;
                    var object = leaf_array[i];
                    var pos = object.pos;
                    if(pos.x >= x1 && pos.x <= x2 && pos.y >= y1 && pos.y <= y2){
                        f(object)
                    }
                }
            }
        }
    }
    
    function area_get(area, f){
        _get_objects(root, area, f);
    }

    return {
        add: add,
        remove: remove,
        get: get,
        area_get: area_get,
    };
});

