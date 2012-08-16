define(["shooter/objects", "dojo/dom", "shooter/vector", "shooter/constants"], function(objects, dom, vector, C){
    var canvas = dom.byId("draw_canvas");
    var ctx = canvas.getContext("2d");
    var center = vector({x: 145.73387946666668, y: 74.09939904641982});
    var pixel_size = C.PIXEL_SIZE;

    function bounds(){
        var w = canvas.width * pixel_size;
        var h = canvas.height * pixel_size;
        return {x1: center.x - w/2, y1: center.y - h/2, x2: center.x + w/2, y2: center.y + h/2};
    }

    return {
        set_center: function(v){
            center = v;
        },
        render: function(){
                ctx.clearRect(0,0, canvas.width, canvas.height);

            var container = []
            function f(object){
                container.push(object);
            }
            var b = bounds()
            objects.area_get(b, f);

            ctx.fillStyle = "black";
            for(var i=0, len = container.length; i<len; i++){
                var pos = container[i].pos;
                ctx.fillRect((pos.x - b.x1)/pixel_size - 5, (pos.y - b.y1)/pixel_size - 5, 10, 10);
            }
        }
    }
});
