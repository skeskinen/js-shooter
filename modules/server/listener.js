define(["shooter/constants", "server/listeners"], function(C, listeners){
    function Listener(pos, socket){
        this.pos = pos;
        this.socket = socket;
  
        //Marks when should change to next listeners tile. Set by server/listeners.
        this.tile_area = [];

        listeners.add_listener(this);
    }
    return Listener;
});
