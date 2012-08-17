/*
 *  Server-side events. They execute and emit themselves.
 */

define(["dojo/_base/lang", "shooter/constants", "server/listeners", "shooter/utils", "shooter/game"], function(lang, C, listeners, utils, game){

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
        var time_left = this.data[1] - new Date().getTime();
        function execute(){
            return game.event(this.data);
        }
        lang.hitch(this, execute);
        
        if(callback){
            execute = utils.enchant(execute, callback);
        }
        setTimeout(execute, time_left);
    }

})
