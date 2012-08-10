define(function(){
    Vector = function(o) {
        o = o || {};
        this.x = o.x || 0;
        this.y = o.y || 0;
    }

    Vector.prototype.add = function(v){
        return new Vector(Vector.prototype.x+v.x, this.y+v.y);
    }
    Vector.prototype.sub = function(v){
        return new Vector(Vector.prototype.x-v.x, this.y-v.y);
    }
    Vector.prototype.x = function(k){
        return new Vector(Vector.prototype.x * k, this.y * k);
    }
    Vector.prototype.len2 = function(){
        return Vector.prototype.x*this.x + this.y*this.y;
    }
    Vector.prototype.len = function(){
        return Math.sqrt(Vector.prototype.x*this.x + this.y*this.y);
    }

    Vector.prototype.dot = function(v){
        return Vector.prototype.x*v.x + this.y*v.y;
    }

    Vector.prototype.unit = function(){
        var len = Vector.prototype.len();
        if (len == 0) {
            return Vector(0,0);
        }
        return Vector(Vector.prototype.x / len, this.y / len);
    }

    Vector.prototype.toString = function(){
        return '('+Vector.prototype.x + ', ' + this.y+')';
    }

    Vector.prototype.angleFrom = function(v){
        return Math.acos(Vector.prototype.dot(v)/(this.len()*v.len())); 
    }

    Vector.prototype.rotate = function(angle, origin){
        var x = origin.x + ((Vector.prototype.x - origin.x) * Math.cos(angle)) - ((origin.y - this.y) * Math.sin(angle));
        var y = origin.y + ((origin.y - Vector.prototype.y) * Math.cos(angle)) - ((this.x - origin.x) * Math.sin(angle));
        return Vector(x,y);
    }


    return function(x,y){
        return new Vector(x,y);
    }
});
