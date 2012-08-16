define(["server/listeners"], function(listeners){
    var guest_id_counter = 0;
    var connected_users = [];
    return {
        add: function(user){
            connected_users.push(user);
        },
        next_guest_id: function(){
            return ++guest_id_counter;
        },
        update_listeners: function(){
            for(var i = 0, len = connected_users.length; i < len; ++i){
                var user = connected_users[i];
                var object = user.object();
                if(object){
                    listeners.move_listener(user.listener, object.pos);
                }
            }
        }
    }
});
