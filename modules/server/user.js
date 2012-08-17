/*
 *  Defines class User. Used as an interface between game logic, event listeners and user input.
 *
 */

define(["dojo/_base/lang", "shooter/constants", "server/event"], function(lang, C, Event){
    var guest_id = 0;

    var User = function(socket){
        this.name = 'guest' + (++guest_id);
        this.socket = socket;

        this.bind_socket();
    }

    /* 
     *  Binds every message that comes from client. 
     *
     *  Also extends socket with send_event function. Socket send_event is 
     *  used by listeners to emit events to clients.
     *  Runned once immidiately after connection is formed.
     */

    User.prototype.bind_socket(){
        socket.send_event = function(e){
            socket.emit('event', e.data);
        }

        lang.hitch(this, this.time_request);
        socket.on('time', this.time_request);

        lang.hitch(this, this.spawn);
        socket.on('spawn', this.spawn);
    }

    /*  
     *  Stamps data with current server time. Used to calculate correct time offset for client.
     */

    User.prototype.time_request = function(data){
        data.s_time = new Date().getTime();
        socket.emit('time', data);
    }

    /*  
     * Creates the event which will create player object.
     * Sets the callback which will be called when object is created.
     * Creates listener to the place where player will spawn.
     *
     * Parameter is spawn position given by client.
     */

    User.prototype.spawn = function(pos){
        lang.hitch(this, this.spawned);
        var e = new Event(pos, [C.EVENT_SPAWN, C.EVENT_DELAY, pos],  this.spawned);

        this.listener = new Listener(pos);
    }

    /*  
     *  Callback which is called when users object is created.
     *  Newly created object is given as parameter.
     */

    User.prototype.spawned = function(object){
        this.object = object;
    }

    return User;
});

