define(["shooter/object","shooter/objects"], function(object, Objects){
    var objects = new Objects();
   
    return {
        objects: objects,
        spawn: function(o){
            o = object(o);
            o.id = objects.next_id();
            objects.add(o);
            return o;
        },
        add_event: function(e){

        }
    }
});

