
function Player(loc){
    google.maps.OverlayView.call(this);
    this.url = 'images/blue_ball.png'
   
    var div = this.div_ = document.createElement('div');
    div.id = 'player';
    var image = this.image_ = document.createElement('img');
    image.src = this.url;
    div.appendChild(image);
    this.location_ = loc
    this.recalc_pixels_ = true;
    this.speed = 80;

    this.setMap(map)

}
Player.prototype = new google.maps.OverlayView;

Player.prototype.onAdd = function(){
    var pane = this.getPanes().overlayLayer;
    pane.appendChild(this.div_);
}

Player.prototype.onRemove = function(){
    this.div_.parentNode.removeChild(this.div_);
}

Player.prototype.draw = function(){
    if (typeof projection === "undefined") {
        projection = this.getProjection();
    }
    if (this.recalc_pixels_) {
        this.pixel_position_ = projection.fromLatLngToDivPixel(this.location_);
        this.recalc_pixels_ = false;
    } else {
        this.location_ = projection.fromDivPixelToLatLng(this.pixel_position_);
    }
    var position = this.pixel_position_;
    $('#player').css('left', position.x-16 + 'px').css('top', position.y-16 + 'px').css('display', 'block');
//    console.log(this.location_.lat() + ' ' + this.location_.lng())
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
    /*
    if (this.recalc_pixels_) {
    */
        this.pixel_position_ = projection.fromLatLngToDivPixel(this.location_);
        this.recalc_pixels_ = false;
    /*
    } else {
        this.location_ = projection.fromDivPixelToLatLng(this.pixel_position_);
    }
    */
    var position = this.pixel_position_;
    $(this.div_).css('left', position.x - 16 + 'px').css('top', position.y - 16 + 'px');
//    console.log(this.location_.lat() + ' ' + this.location_.lng())
}

function Bullet_canvas(){
    google.maps.OverlayView.call(this);

    var canvas = this.canvas_ = document.createElement('canvas');
    canvas.id = 'bullet_canvas';
    $(canvas).attr('width', map_w).attr('height', map_h);
    this.context_ = canvas.getContext('2d');

    this.setMap(map);
}
Bullet_canvas.prototype = new google.maps.OverlayView;

Bullet_canvas.prototype.onAdd = function(){
    var pane = this.getPanes().overlayLayer;
    pane.appendChild(this.canvas_);
}

Bullet_canvas.prototype.onRemove = function(){
    this.canvas_.parentNode.removeChild(this.canvas_);
}

Bullet_canvas.prototype.draw = function(){
    var ctx = this.context_;
    var offset_x = player.pixel_position_.x - map_w/2
    var offset_y = player.pixel_position_.y - map_h/2
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
    $('#bullet_canvas').css('left', offset_x).css('top', offset_y).css('display', 'block');
}

function initialize() {
        var start_loc = new google.maps.LatLng(60.169864,24.938268)
        var mapOptions = {
          center: start_loc,
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
          center: start_loc,
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          draggable: false,
          scrollwheel: false,
          zoomControl: false,
          scaleControl: false,
          disableDoubleClickZoom: true,
          
          styles: [ { stylers: [ { visibility: "off" } ] },{ featureType: "road", elementType: "geometry", stylers: [ { visibility: "on" }, { saturation: 1 }, { weight: 8 }, { color: "#ff00ff" } ] } ]
        };
        map_w = $('#map_canvas').width()
        map_h = $('#map_canvas').height()
        map = new google.maps.Map($('#map_canvas').get(0),
            mapOptions);
        hidden_map = new google.maps.Map($('#hidden_map').get(0),
            hidden_map_options);
        
        last_update = new Date().getTime();
        bullets = new Array();
        enemies = new Array();

        player = new Player(start_loc);
        bullet_canvas = new Bullet_canvas();

        last_shot = 0;
        cooldown = 300;
   
        hidden_map_size = 100;
        hidden_canvas_size = 10;

        is_down = new Array();

        hidden_canvas_ctx = $('#hidden_canvas').get(0).getContext('2d');

        setTimeout(update, 500);
        setTimeout(road_check, 1000);
}

function update() {
    var cur_time = new Date().getTime();
    var time_d = cur_time - last_update;
    last_update = cur_time
    
    bullets = _.select(bullets, function(bullet){
        bullet.con_pos = bullet.con_pos.add(bullet.dir.x(bullet.speed * time_d/1000))
        bullet.div_pos = bullet.div_pos.add(bullet.dir.x(bullet.speed * time_d/1000))
        return cur_time - bullet.birth_time < 2000
    });

    var player_move = $V([0,0])
    if (is_down['a']){
        player_move.elements[0] -= 1;
    }
    if (is_down['d']){
        player_move.elements[0] += 1;
    }
    if (is_down['w']){
        player_move.elements[1] -= 1;
    }
    if (is_down['s']){
        player_move.elements[1] += 1;
    }
    
    player_move = player_move.toUnitVector().x(player.speed * time_d/1000);
    move(player_move.e(1), player_move.e(2));

    player.draw();
    bullet_canvas.draw();
    _(enemies).each(function(enemy){
        enemy.draw();
    });

    update_hook = setTimeout(update, 50);
}

function road_check(){
    var ctx = hidden_canvas_ctx;
    
    ctx.clearRect(0,0,25,25);

    road_check_images = new Array();
    road_check_loaded = 0;
    _($('#hidden_map img[style*="width: 256px"]')).each(function(image){
        var img = new Image();
        img.crossOrigin = '';
        img.onload = road_check_image_load;
        img.src = image.src;
        img.x_ = parseInt($(image.parentNode).css('left'))
        img.y_ = parseInt($(image.parentNode).css('top'))
        road_check_images.push(img);
    });

}

function road_check_image_load(){
    road_check_loaded++;
    if (road_check_loaded == road_check_images.length) {
        road_check_finish();
    }
}

function road_check_finish(){
    var ctx = hidden_canvas_ctx;
    var images = road_check_images;
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
    }else if (transform_div.css('top')){
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

    /*
    _(images).each(function(image){
        ctx.drawImage(image, image.x_ -start_x, image.y_ -start_y);
    });

    ctx.fillStyle = 'black';

    ctx.fillRect(-start_x-transform_x +45, -start_y-transform_y +45, 10, 10);
    */

    var on_road = false;
    var pix = ctx.getImageData(0,0,hidden_canvas_size, hidden_canvas_size).data;
    for (var i = 0; n = pix.length, i < n; i += 4) {
//        console.log(pix[i] + ' ' + pix[i+1] + ' ' + pix[i+2])
        if (pix[i] > 200 && pix[i+1] < 50 && pix[i+2] > 200) {
            on_road = true;
        }
    }
 //   console.log(on_road);
    
    if(on_road){
        player.speed = 40;
    } else {
        player.speed = 10;
    }

    road_check_hook = setTimeout(road_check, 600);
}

function spawn_enemy(loc){
    var enemy = new Enemy(loc);
    enemies.push(enemy);
    return enemy;
}

function spawn_bullet(loc, angle){
    var div_position = projection.fromLatLngToDivPixel(loc);
    var con_position = projection.fromLatLngToContainerPixel(loc);
   // console.log(position);
    var bullet = new Bullet(div_position, con_position, angle);
    bullets.push(bullet);
    return bullet;
}

function shoot(){
    if (is_down['mouse'] && new Date().getTime() - last_shot >= cooldown-1) {
        last_shot = last_update;
        var center = $V([map_w/2,map_h/2]);
        var mouse_pos = $V([mouse_x, mouse_y]);
        var diff = mouse_pos.subtract(center);
        var angle = diff.angleFrom($V([1,0]));
        if(diff.e(2) < 0) {
            angle = 2 * Math.PI - angle;
        }
        var bullet = spawn_bullet(player.location_, angle);
        bullet.check_hits();

        setTimeout(shoot, cooldown);
    }
}

function remove_enemy(enemy){
    enemy.setMap(null);
    enemies = _(enemies).without(enemy);
}

function Bullet(div_pos, con_pos, angle){ 
    this.div_pos = $V([div_pos.x, div_pos.y]);
    this.con_pos = $V([con_pos.x, con_pos.y]);
    this.angle = angle;
    this.dir = $V([Math.cos(angle), Math.sin(angle)]);
    this.speed = 4000; //px per second
    this.birth_time = last_update;
}

Bullet.prototype.check_hits = function(){
    _(enemies).each(function(enemy){
        var enemy_pos = $V([enemy.pixel_position_.x, enemy.pixel_position_.y]);
        if (Math.abs(this.dir.rotate(Math.PI/2, $V([0,0])).dot(this.div_pos.subtract(enemy_pos))) < 16) {
            var line_pos = enemy_pos.add(this.dir.rotate(Math.PI/2, $V([0,0])).x(this.dir.rotate(Math.PI/2, $V([0,0])).dot(this.div_pos.subtract(enemy_pos))));
            if(line_pos.subtract(this.div_pos).isParallelTo(this.dir)){
                remove_enemy(enemy);
            }
        }
    }, this);
}

function move(x, y) {
    map.panBy(x,y);
    hidden_map.panBy(x,y);
    player.pixel_position_.x += x;
    player.pixel_position_.y += y;
    player.draw()
}

$(document).ready(function(){
    initialize()

    $(document).keydown(function(event){
    switch(event.which){
            case 65:
            is_down['a'] = true;
            break;
            case 87:

            case 188:
            is_down['w'] = true;
            break;
            case 68:

            case 69:
            is_down['d'] = true;
            break;
            case 83:
            
            case 79:
            is_down['s'] = true;
            break;
        }
    });

    $(document).keyup(function(event){
        switch(event.which){
            case 65:
            is_down['a'] = false;
            break;
            case 87:

            case 188:
            is_down['w'] = false;
            break;
            case 68:

            case 69:
            is_down['d'] = false;
            break;
            case 83:
            
            case 79:
            is_down['s'] = false;
            break;
        }
    });

    $(document).mousedown(function(event){
        is_down['mouse'] = true;
        mouse_x = event.pageX;
        mouse_y = event.pageY;
        shoot();
    });

    $(document).mousemove(function(event){
        mouse_x = event.pageX;
        mouse_y = event.pageY;
    });

    $(document).mouseup(function(event){
        is_down['mouse'] = false;
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
