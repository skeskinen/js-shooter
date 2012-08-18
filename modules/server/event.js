/*
 *  Server-side events. They execute and emit themselves.
 */

define(["shooter/constants", "server/listeners", "shooter/utils", "shooter/game"], function(C, listeners, utils, game){

    /*
     *  Creates new event, transmits it to the listeners and executes when time.
     *  Data is is array of format [event type, execution time, ...].
     *  Data is transmitted to clients and given to game engine.
     */

    function Event(pos, data, callback){
        this.pos = pos;
        this.data = data;
        this.callback = callback;
       

        this.set_execution();

        listeners.send_event(this);
    }
  
    /*
     *  Gives data to game when the event should be executed.
     *  Return value of game.event() call is given as a parameter 
     *  to callback function via utils.enchant.
     */

    Event.prototype.set_execution = function(){
        var data = this.data
        var time_left = data[1] - new Date().getTime();
        function execute(){
            return game.event(data);
        }
        
        if(this.callback){
            execute = utils.enchant(execute, this.callback);
        }
        setTimeout(execute, time_left);
    }
    
    return Event;

})
