define(["shooter/constants", "server/listeners"], function(C, listeners){
    function Listener(pos, socket){
        this.pos = pos;
        this.socket = socket;
        
        listeners.add_listener(this);
    }
    return Listener;
});
