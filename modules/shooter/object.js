
define(["shooter/constants", "shooter/vector"], function(C, vector){

    var Object = function(o){
        for (i in o) {
          this[i] = o[i];
        }
        this.pos = this.pos || vector();
        this.type = this.type || C.TYPE_NO_TYPE;
        this.move = this.move || vector();
    };

    Object.prototype.toJSON = function(){
      return {
        pos: this.pos,
        type: this.type,
        id: this.id
      }
    }

    return function(o){
        return new Object(o);
    }
});

