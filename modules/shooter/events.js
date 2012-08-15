define(["shooter/networking", "shooter/vector", "shooter/maps", "dojo/dom", "dojo/on", "dojo/keys", "dojo/domReady!"], function(networking, vector, maps, dom, on, keys){
    var is_down = new Array();
    function get_mouse_angle(){
        var center = vector(map_w/2,map_h/2);
        var mouse_pos = vector(mouse_x, mouse_y);
        var diff = mouse_pos.sub(center);
        var angle = diff.angleFrom(vector(1,0));
        if(diff.e(2) < 0) {
            angle = 2 * Math.PI - angle;
        }
        return angle;
    }

    function get_move(){
        var x = 0;
        var y = 0;

        if(is_down['a']) {
            x -=1;
        }
        if(is_down['d']) {
            x +=1;
        }
        if(is_down['w']) {
            y +=1;
        }
        if(is_down['s']){
            y -=1;
        }

        return vector(x,y);
    }

    return {
        bind: function(){
                on(window, "keydown", function(event){
                    console.log(event, keys);
                    switch(event.which){
                        case 65:
                            is_down['a'] = true;
                            networking.send_move(get_move());
                            break;
                        case 87:

                        case 188:
                            is_down['w'] = true;
                            networking.send_move(get_move());
                            break;

                        case 68:

                        case 69:
                            is_down['d'] = true;
                            networking.send_move(get_move());
                            break;

                        case 83:

                        case 79:
                            is_down['s'] = true;
                            networking.send_move(get_move());
                            break;
                    }
                });

                on(document, "keyup", function(event){
                    switch(event.which){
                        case 65:
                            is_down['a'] = false;
                            networking.send_move(get_move());
                            break;
                        case 87:

                        case 188:
                            is_down['w'] = false;
                            networking.send_move(get_move());
                            break;
                        case 68:

                        case 69:
                            is_down['d'] = false;
                            networking.send_move(get_move());
                            break;
                        case 83:

                        case 79:
                            is_down['s'] = false;
                            networking.send_move(get_move());
                            break;
                    }
                });
/*
                $(document).mousedown(function(event){
                    is_down['mouse'] = true;
                    mouse_x = event.pageX;
                    mouse_y = event.pageY;

                    networking.send_mouse_angle(get_mouse_angle());
                    networking.send_shooting(true);
                });
                
                $(document).mouseup(function(event){
                    is_down['mouse'] = false;
                    networking.send_shooting(false);
                });

                maps.bind_mouse_listener();
*/
                /*
                $(window).resize(function(){
                var d_x = $('#map_canvas').width() - map_w;
                var d_y = $('#map_canvas').height() - map_h;
                map_w = $('#map_canvas').width();
                map_h = $('#map_canvas').height();

                map.panBy(-d_x/2, -d_y/2);

                player.recalc_pixels_ = true;
                player.draw();
                });
                */
        }
    }
});
