define(["shooter/object","shooter/objects", "shooter/utils", "shooter/constants"], function(object, objects, utils, C){
    function event(e){
        if(e[0] === C.EVENT_SPAWN){
            objects.add(data);
        }else{
            var object = objects.get(e.id);
            for(i in data) {
                object[i] = data[i];
            }
        }
    }
   
    return {
        event:event
    }
});

