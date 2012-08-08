
TYPE_HUMAN = 1;
TYPE_NPC = 2;
TYPE_PLAYER = 3;

TERRAIN_ROAD = 1;
TERRAIN_LAND = 2;
TERRAIN_WATER = 3;

function Object(loc, type, id){
    google.maps.OverlayView.call(this);

    if(type === TYPE_PLAYER){
        this.speed = 50;
        this.url = 'images/blue_ball.png';
    }
    if(type === TYPE_NPC){
        this.url = 'images/red_ball.png';
    }
    if(type === TYPE_HUMAN){
        this.url = 'images/yellow_ball.png';
    }

    this.id = id;
    this.type = type;

    this.h = 32;
    this.w = 32;


    var div = this.div_ = document.createElement('div');
    $(div).addClass('object');
    var image = this.image_ = document.createElement('img');
    image.src = this.url;
    div.appendChild(image);
    this.location_ = loc

    this.setMap(map)
}

Object.prototype = new google.maps.OverlayView;

Object.prototype.onAdd = function(){
    var pane = this.getPanes().overlayLayer;
    pane.appendChild(this.div_);
}

Object.prototype.onRemove = function(){
    this.div_.parentNode.removeChild(this.div_);
}

Object.prototype.draw = function(){
    if (typeof projection === "undefined") {
        projection = this.getProjection();
    }
    
    this.pixel_position_ = projection.fromLatLngToDivPixel(this.location_);

    var position = this.pixel_position_;
    $(this.div_).css('left', position.x - this.w/2 + 'px').css('top', position.y - this.h/2 + 'px').css('display', 'block');
//    console.log(this.location_.lat() + ' ' + this.location_.lng())
}

Object.prototype.calc_location = function() {
    this.location_ = projection.fromDivPixelToLatLng(this.pixel_position_);
}

function Enemy(loc){
    google.maps.OverlayView.call(this);
    this.url = 'images/red_ball.png'
   
    var div = this.div_ = document.createElement('div');
    $(div).addClass('enemy');
    var image = this.image_ = document.createElement('img');
    image.src = this.url;
    div.appendChild(image);
    this.location_ = loc
    this.recalc_pixels_ = true;

    this.setMap(map)
}
Enemy.prototype = new google.maps.OverlayView;

Enemy.prototype.onAdd = function(){
    var pane = this.getPanes().overlayLayer;
    pane.appendChild(this.div_);
}

Enemy.prototype.onRemove = function(){
    this.div_.parentNode.removeChild(this.div_);
}

Enemy.prototype.draw = function(){
    this.pixel_position_ = projection.fromLatLngToDivPixel(this.location_);
    this.recalc_pixels_ = false;
    var position = this.pixel_position_;
    $(this.div_).css('left', position.x - 16 + 'px').css('top', position.y - 16 + 'px');
}

function draw_bullets(){
    var ctx = bullet_canvas_ctx;
    ctx.clearRect(0,0,map_w, map_h);
    ctx.strokeStyle = 'black';
    ctx.lineWidth=2
    _(bullets).each(function(bullet){
        ctx.beginPath();
        ctx.moveTo(bullet.con_pos.e(1), bullet.con_pos.e(2));
        var end = bullet.con_pos.add(bullet.dir.x(50));
        ctx.lineTo(end.e(1), end.e(2));
        ctx.stroke();
    });
}

function initialize() {
        var mapOptions = {
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          draggable: false,
          scrollwheel: false,
          zoomControl: false,
          scaleControl: false,
          disableDoubleClickZoom: true,
          

          styles: [ { featureType: "transit", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "road", elementType: "labels", stylers: [ { visibility: "off" } ] } ]
        };

        var hidden_map_options = {
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          draggable: false,
          scrollwheel: false,
          zoomControl: false,
          scaleControl: false,
          disableDoubleClickZoom: true,
          
          styles: [ { stylers: [ { visibility: "off" } ] },{ featureType: "road", elementType: "geometry", stylers: [ { visibility: "on" }, { saturation: 1 }, { weight: 8 }, { color: "#ff00ff" } ] }, { featureType: "water", elementType: "geometry", stylers: [ { visibility: "on" }, { color: "#00ff00" } ] }]
        };
        map_w = $('#map_canvas').width()
        map_h = $('#map_canvas').height()
        map = new google.maps.Map($('#map_canvas').get(0),
            mapOptions);
        hidden_map = new google.maps.Map($('#hidden_map').get(0),
            hidden_map_options);
        
        bullets = new Array();
        objects = new Array();
    
        init_projectiles();
    
        laser_img = new Image();
        laser_img.src = 'images/laser.png';

        last_shot = 0;
        cooldown = 300;
   
        hidden_map_size = 100;
        hidden_canvas_size = 10;

        is_down = new Array();

        hidden_canvas_ctx = $('#hidden_canvas').get(0).getContext('2d');
}

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

function terrain_check(){
    var ctx = hidden_canvas_ctx;
    
    ctx.clearRect(0,0,25,25);

    terrain_check_images = new Array();
    terrain_check_loaded = 0;
    _($('#hidden_map img[style*="width: 256px"]')).each(function(image){
        var img = new Image();
        img.crossOrigin = '';
        img.onload = terrain_check_image_load;
        img.src = image.src;
        img.x_ = parseInt($(image.parentNode).css('left'))
        img.y_ = parseInt($(image.parentNode).css('top'))
        terrain_check_images.push(img);
    });

}

function terrain_check_image_load(){
    terrain_check_loaded++;
    if (terrain_check_loaded == terrain_check_images.length) {
        terrain_check_finish();
    }
}

function terrain_check_finish(){
    var ctx = hidden_canvas_ctx;
    var images = terrain_check_images;
    images.sort(function(a,b){
        if(a.x_ != b.x_) {
            return a.x_ > b.x_;
        }
        return a.y_ > b.y_;
    });

    var start_x = images[0].x_;
    var start_y = images[0].y_;

    var transform_x = 0;
    var transform_y = 0;

    var transform_div = $('#hidden_map div div div:first');
    if(transform_div.css('-webkit-transform')){
        var strs = transform_div.css('-webkit-transform').split(',');
        transform_x = parseInt(strs[4]);
        transform_y = parseInt(strs[5]);
    }  else if (transform_div.css('top')){
        transform_x = parseInt(transform_div.css('left'));
        transform_y = parseInt(transform_div.css('top'));
    }else{
        console.log('no transform :( paska selain tjn');
    }
    
    _(images).each(function(image){
//        console.log(transform_x);
//        console.log((image.x_ + transform_x - hidden_map_size/2 + hidden_canvas_size/2) + ' ' + (image.y_ + transform_y - hidden_map_size/2 + hidden_canvas_size/2));
        ctx.drawImage(image, image.x_ + transform_x - hidden_map_size/2 + hidden_canvas_size/2, image.y_ + transform_y - hidden_map_size/2 + hidden_canvas_size/2);
    });

    var on_road = false;
    var on_water = false;
    var pix = ctx.getImageData(0,0,hidden_canvas_size, hidden_canvas_size).data;
    for (var i = 0; n = pix.length, i < n; i += 4) {
//        console.log(pix[i] + ' ' + pix[i+1] + ' ' + pix[i+2])
        if (pix[i] > 200 && pix[i+1] < 50 && pix[i+2] > 200) {
            on_road = true;
        }
        if (pix[i] < 50 && pix[i+1] > 200 && pix[i+2] < 50) {
            on_water = true;
        }
    }
 //   console.log(on_terrain);
    
    if(on_road){
        player.terrain_ = TERRAIN_ROAD;
    } else if (on_water) {
        player.terrain_ = TERRAIN_WATER;
    } else {
        player.terrain_ = TERRAIN_LAND;
    }

    socket.emit('terrain', player.terrain_);

    terrain_check_hook = setTimeout(terrain_check, 200);
}

function get_object(id){
    return _(objects).find(function(object){
        return object.id === id;
    });
}

function spawn(data){
    if(get_object(data.id)){
        return null;
    }
    var loc = new google.maps.LatLng(data.loc.lat, data.loc.lng);
    var o = new Object(loc, data.type, data.id);
    objects.push(o);
    return o;
}

function remove(id){
    objects = _(objects).filter(function(object){
        if(object.id === id){
            if (object.type === TYPE_PLAYER) {
                window.location.href = '/death';
            }
            object.setMap(null);
            return false;
        }
        return true;
    });
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

function send_mouse_angle(){
    if (is_down['mouse']) {
        var center = $V([map_w/2,map_h/2]);
        var mouse_pos = $V([mouse_x, mouse_y]);
        var diff = mouse_pos.subtract(center);
        var angle = diff.angleFrom($V([1,0]));
        if(diff.e(2) < 0) {
            angle = 2 * Math.PI - angle;
        }
        socket.emit('angle', angle);
        setTimeout(send_mouse_angle, 40);
    }
}

function Bullet(div_pos, con_pos, angle){ 
    this.div_pos = $V([div_pos.x, div_pos.y]);
    this.con_pos = $V([con_pos.x, con_pos.y]);
    this.angle = angle;
    this.dir = $V([Math.cos(angle), Math.sin(angle)]);
    this.speed = 4000; //px per second
}

Bullet.prototype.check_hits = function(){
    var hits = new Array();
    _(objects).each(function(object){
        var object_pos = $V([object.pixel_position_.x, object.pixel_position_.y]);
        if ( this.div_pos.subtract(object_pos).modulus() < 500){
            if (Math.abs(this.dir.rotate(Math.PI/2, $V([0,0])).dot(this.div_pos.subtract(object_pos))) < 16) {
                var line_pos = object_pos.add(this.dir.rotate(Math.PI/2, $V([0,0])).x(this.dir.rotate(Math.PI/2, $V([0,0])).dot(this.div_pos.subtract(object_pos))));
                if(line_pos.subtract(this.div_pos).isParallelTo(this.dir)){
                    hits.push(object.id);
                    //remove_object(object);
                }
            }
        }
    }, this);
    return hits;
}

function move(x, y) {
    map.panBy(x,y);
    hidden_map.panBy(x,y);
    player.pixel_position_.x += x;
    player.pixel_position_.y += y;

    player.calc_location()
}

function socket(){
    socket = io.connect();
    socket.on('spawn_player', function(data){
//        var latlng = rad;
        var location = new google.maps.LatLng(data.loc.lat, data.loc.lng);
        map.setCenter(location);
        hidden_map.setCenter(location);
        player = new Object(location, TYPE_PLAYER, data.id);
        objects.push(player);
        setTimeout(terrain_check, 500);
    });

    socket.on('spawn', function(data){
        spawn(data);
    });

    socket.on('remove', function(id){
        remove(id);
    });

    socket.on('update', function(data){
        _(data).each(function(object){
            var o = get_object(object.id);
            o.location_ = new google.maps.LatLng(object.loc.lat, object.loc.lng);
        });
        map.setCenter(player.location_);
        hidden_map.setCenter(player.location_);
    });

    socket.on('shot', function(data){
        var shooter = get_object(data.shooter);
        if (shooter !== undefined){
            spawn_bullet(shooter.location_, data.angle);
        }
    });
}

function send_move(){
    var x = 0;
    var y = 0;

    if(is_down['a']) {
        x -=1;
    }
    if(is_down['d']) {
        x +=1;
    }
    if(is_down['w') {
        y +=1;
    }
    if(is_down['s']){
        y -=1;
    }

    socket.emit('move', {x:x, y:y});

}

$(document).ready(function(){
    initialize();
    socket();

    $(document).keydown(function(event){
    switch(event.which){
            case 65:
            is_down['a'] = true;
            send_move();
            break;
            case 87:

            case 188:
            is_down['w'] = true;
            send_move();
            break;
            case 68:

            case 69:
            is_down['d'] = true;
            send_move();
            break;
            case 83:
            
            case 79:
            is_down['s'] = true;
            send_move();
            break;
        }
    });

    $(document).keyup(function(event){
        switch(event.which){
            case 65:
            is_down['a'] = false;
            send_move();
            break;
            case 87:

            case 188:
            is_down['w'] = false;
            send_move();
            break;
            case 68:

            case 69:
            is_down['d'] = false;
            send_move();
            break;
            case 83:
            
            case 79:
            is_down['s'] = false;
            send_move();
            break;
        }
    });

    $(document).mousedown(function(event){
        is_down['mouse'] = true;
        mouse_x = event.pageX;
        mouse_y = event.pageY;
        send_mouse_angle();
        socket.emit('shoot', true);
    });

    $(document).mousemove(function(event){
        mouse_x = event.pageX;
        mouse_y = event.pageY;
    });

    $(document).mouseup(function(event){
        is_down['mouse'] = false;
        socket.emit('shoot', false);
    });

    $(window).resize(function(){
        var d_x = $('#map_canvas').width() - map_w;
        var d_y = $('#map_canvas').height() - map_h;
        map_w = $('#map_canvas').width();
        map_h = $('#map_canvas').height();
        
        map.panBy(-d_x/2, -d_y/2);

        player.recalc_pixels_ = true;
        player.draw();
    });
});
