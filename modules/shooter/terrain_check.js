define(["shooter/maps", "shooter/networking", "shooter/constants"], function(maps, networking, C){

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
                break;
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

});
