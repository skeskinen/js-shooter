define(function(){
    return function(x,y){
        return new Vector(x,y);
    }
});
Vector = function(x,y) {
    this.x = x;
    this.y = y;

    this.add = function(v){
        return new Vector(this.x+v.x, this.y+v.y);
    }
    this.sub = function(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }
    this.len2 = function(){
        return this.x*this.x + this.y*this.y;
    }
    this.len = function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    this.unit = function(){
        var len = this.len();
        if (len == 0) {
            return Vector(0,0);
        }
        return Vector(this.x / len, this.y / len);
    }

    this.toString = function(){
        return '('+this.x + ', ' + this.y+')';
    }
}
