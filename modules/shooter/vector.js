define(function(){
    Vector = function(x,y) {
        this.x = x || 0;
        this.y = x || 0;
    }

    Vector.prototype.add = function(v){
        return new Vector(this.x+v.x, this.y+v.y);
    }
    Vector.prototype.sub = function(v){
        return new Vector(this.x-v.x, this.y-v.y);
    }
    Vector.prototype.x = function(k){
        return new Vector(this.x * k, this.y * k);
    }
    Vector.prototype.len2 = function(){
        return this.x*this.x + this.y*this.y;
    }
    Vector.prototype.len = function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    Vector.prototype.dot = function(v){
        return this.x*v.x + this.y*v.y;
    }

    Vector.prototype.unit = function(){
        var len = this.len();
        if (len == 0) {
            return Vector(0,0);
        }
        return Vector(this.x / len, this.y / len);
    }

    Vector.prototype.toString = function(){
        return '('+this.x + ', ' + this.y+')';
    }

    Vector.prototype.angleFrom = function(v){
        return Math.acos(this.dot(v)/(this.len()*v.len())); 
    }

    Vector.prototype.rotate = function(angle, origin){
        var x = origin.x + ((this.x - origin.x) * Math.cos(angle)) - ((origin.y - this.y) * Math.sin(angle));
        var y = origin.y + ((origin.y - this.y) * Math.cos(angle)) - ((this.x - origin.x) * Math.sin(angle));
        return Vector(x,y);
    }


    return function(x,y){
        return new Vector(x,y);
    }
});
