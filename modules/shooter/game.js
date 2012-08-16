define(["shooter/object","shooter/objects", "shooter/utils", "shooter/constants"], function(object, objects, utils, C){
   
    return {
        add_event: function(e){
            function event_handler(){
                var data = e.data;
                if(e.type === C.EVENT_SPAWN){
                    objects.add(data);
                }else{
                    var object = objects.get(e.id);
                    for(i in data) {
                        object[i] = data[i];
                    }
                }
            }
            
            setTimeout(event_handler, e.time-utils.time());
        },
    }
});

