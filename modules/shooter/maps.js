define(["shooter/vector", "dojo/dom", "shooter/constants", "dojo/domReady!"], function(vector, dom, C){
    var main_map_styles =[ 
        { elementType: "labels", stylers: [ { visibility: "off" } ] },
        { elementType: "geometry", stylers: [ { gamma: 0.10 } ] },
        { featureType: "road.local", stylers: [ { lightness: -50 } ] },
        { featureType: "transit", stylers: [ { visibility: "off" } ] },
        { featureType: "administrative", stylers: [ { visibility: "off" } ] } 
    ]


    var terrain_map_styles = [
        { stylers: [ { visibility: "off" } ] },
        { featureType: "road", elementType: "geometry", stylers: [ { visibility: "on" }, { weight: 8 }, { color: "#ff00ff" } ] }, 
        { featureType: "water", elementType: "geometry", stylers: [ { visibility: "on" }, { color: "#00ff00" } ] }
    ];

    var main_map_options = {
        zoom: C.ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(60.169864, 24.938268),

        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        zoomControl: false,
        scaleControl: false,
        disableDoubleClickZoom: true,

        styles: main_map_styles
    };

    var terrain_map_options = {
        zoom: C.ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(60.169864, 24.938268),

        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        zoomControl: false,
        scaleControl: false,
        disableDoubleClickZoom: true,

        styles: terrain_map_styles
    };

    var origin = vector(C.WORLD_SIZE/2, C.WORLD_SIZE/2);
    var px_per_deg = C.WORLD_SIZE /360;
    var px_per_rad = C.WORLD_SIZE / (2 * Math.PI);
    
    function to_LatLng(v){
        var lng = (v.x - origin.x) / px_per_deg;
        var latRadians = (point.y - origin.y) / -px_per_rad;
        var lat = (2 * Math.atan(Math.exp(latRadians)) -
        Math.PI / 2) * 180 / Math.PI;
        return new google.maps.LatLng(lat, lng);
    }

    function to_world_coord(latLng) {
        console.log(latLng);
        var coord = vector();
        coord.x = Math.floor(origin.x + latLng.lng() * px_per_deg);

        var siny = Math.sin(latLng.lat() / 180 * Math.PI);
        coord.y = Math.floor(origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -px_per_rad);
        return coord;
    };

    //var main_map = new google.maps.Map(dom.byId('main_map'), main_map_options);
    //var terrain_map = new google.maps.Map(dom.byId('terrain_map'), terrain_map_options);

    return {
        set_center: function(v) {
            main_map.setCenter(to_LatLng(v));
            terrain_map.setCenter(to_LatLng(v));
        },
        get_center: function(){
            return to_world_coord(main_map.getCenter());
        },
        to_LatLng: to_LatLng,
        to_world_coord: to_world_coord,
        bind_mouse_listener: function(f){
            google.maps.event.addListener(main_map, 'mousemove',function(event){
              var coord = to_world_coord(event.latLng);
              f(coord);
//              console.log(event.latLng.lat() + ' ' + event.latLng.lng() + ' ' + coord.x + ' ' + coord.y);
            });
        },

    }


});
