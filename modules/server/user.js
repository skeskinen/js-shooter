/*
 *  Defines class User. Used as an interface between game logic, event listeners and user input.
 *
 */

define(["shooter/constants", "shooter/vector", "shooter/objects", "server/event", "server/listener"], function(C, vector, objects, Event, Listener){
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

    User.prototype.bind_socket = function(){
        var socket = this.socket;
        socket.send_event = function(e){
            socket.emit('event', e.data);
        }

        socket.on('time', this.time_request.bind(this));

        socket.on('spawn', this.spawn.bind(this));

        socket.on('move', this.move.bind(this));
    }

    /*  
     *  Stamps data with current server time. Used to calculate correct time offset for client.
     */

    User.prototype.time_request = function(data){
        data.s_time = new Date().getTime();
        this.socket.emit('time', data);
    }

    /*
     * User input callback.
     * Creates the event which will create player object.
     * Sets the callback which will be called when object is created.
     * Creates listener to the place where player will spawn.
     *
     * Parameter is spawn position given by client.
     */

    User.prototype.spawn = function(pos){
        var e = new Event(pos, [C.EVENT_SPAWN, C.EVENT_DELAY, objects.next_id(), pos.x, pos.y, C.TYPE_HUMAN],  this.spawned.bind(this));

        this.listener = new Listener(vector(pos.x, pos.y), this.socket);
    }

    /*  
     *  Callback which is called when users object is created.
     *  Newly created object is given as parameter.
     */

    User.prototype.spawned = function(object){
        this.object = object;
    }

    /*
     * User input callback.
     *
     */
    
    User.prototype.move = function(move){
        if(this.object){
            this.object.modules[C.ROLE_MOVE].set_move(vector(move.x, move.y).unit());
        }
    }

    return User;
});

