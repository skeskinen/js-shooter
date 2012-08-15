define([], function(){
    var guest_id_counter = 0;
    var connected_users = [];
    return {
        add: function(user){
            connected_users.push(user);
        },
        next_guest_id: function(){
            return ++guest_id_counter;
        }
    }
});
