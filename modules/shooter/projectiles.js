
function init_projectiles() {
    projectiles = new Array();
    var table = {
        laser: ['images/laser.png', 20]
    }

    for (x in table){
        projectiles[x] = new Array();
        for (i =0; i<table[x][1]; i++){
            var img = document.createElement('img');
            img.src = table[x][0];
            $(img).addClass(x).addClass('hidden').appendTo($('#container'));
            img.unused = true;
            projectiles[x].push(img);
        }
    }
}

function get_projectile(name){
    var free = _(projectiles[name]).find(function(node){
        return node.unused === true;
    });
    if ( free === undefined ) {
        free = projectiles[name][0];
    }
    free.unused = false;
    $(free).removeClass('hidden');
    return free;
}

function rotate_projectile(projectile, angle){
    $(projectile).css('transform', 'rotate('+(angle+ 3/2*Math.PI)+'rad)');
    $(projectile).css('-moz-transform', 'rotate('+(angle+ 3/2*Math.PI)+'rad)');
    $(projectile).css('-webkit-transform', 'rotate('+(angle+ 3/2*Math.PI)+'rad)');
    $(projectile).css('-ms-transform', 'rotate('+(angle+ 3/2*Math.PI)+'rad)');
    $(projectile).css('-o-transform', 'rotate('+(angle+ 3/2*Math.PI)+'rad)');
}

function dismiss_projectile(o){
    o.unused = true;
    $(o).addClass('hidden');
}

function spawn_bullet(loc, angle){
    var div_position = projection.fromLatLngToDivPixel(loc);
    var con_position = projection.fromLatLngToContainerPixel(loc);
    
    var bullet = new Bullet(div_position, con_position, angle);
    bullets.push(bullet);

    var projectile = get_projectile('laser')
    projectile.style.left=con_position.x+'px';
    projectile.style.top=con_position.y+'px';
  
    rotate_projectile(projectile, angle);

    //have to use timeout to get animated transition
    setTimeout(function(){
            projectile.style.left= con_position.x + bullet.dir.x(450).e(1)+'px';
            projectile.style.top= con_position.y + bullet.dir.x(450).e(2)+'px';
        },5);

        setTimeout(function(){
            dismiss_projectile(projectile);
        }, 500);
    return bullet;
}

function Bullet(div_pos, con_pos, angle){ 
    this.div_pos = vector(div_pos.x, div_pos.y);
    this.con_pos = vector(con_pos.x, con_pos.y);
    this.angle = angle;
    this.dir = vector(Math.cos(angle), Math.sin(angle));
    this.speed = 4000; //px per second
}

Bullet.prototype.check_hits = function(){
    var hits = new Array();
    _(objects).each(function(object){
        var object_pos = vector(object.pixel_position_.x, object.pixel_position_.y);
        if ( this.div_pos.sub(object_pos).modulus() < 500){
            if (Math.abs(this.dir.rotate(Math.PI/2, vector(0,0)).dot(this.div_pos.sub(object_pos))) < 16) {
                var line_pos = object_pos.add(this.dir.rotate(Math.PI/2, vector(0,0)).x(this.dir.rotate(Math.PI/2, vector(0,0)).dot(this.div_pos.sub(object_pos))));
                if(line_pos.sub(this.div_pos).isParallelTo(this.dir)){
                    hits.push(object.id);
                    //remove_object(object);
                }
            }
        }
    }, this);
    return hits;
}
