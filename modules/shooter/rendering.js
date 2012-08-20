define(["shooter/objects", "dojo/dom", "dojo/dom-class", "shooter/vector", "shooter/constants"], function(objects, dom, dom_class, vector, C){
    var center = vector(38203262, 19424896);
    
    var container = dom.byId('main_container');
    var w = container.offsetWidth;
    var h = container.offsetHeight;

                var camera = new THREE.OrthographicCamera( w / -2, w / 2, h / 2, h / -2, - 2000, 1000 );
                camera.position.y = 200;
                camera.position.x = 100;

                var scene = new THREE.Scene();

                scene.add( new THREE.AmbientLight( 0xffffff ) );
                
                var renderer = new THREE.CanvasRenderer();
                //var renderer = new THREE.WebGLRenderer();
                renderer.setSize( w, h );
                
                var texture = THREE.ImageUtils.loadTexture( 'assets/robot.png' );
                texture.needsUpdate = true;
                var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } ); 
    var animations = [];
    var offset = [];

                renderer_canvas = renderer.domElement;
    dom_class.add( renderer_canvas, 'renderer' );
    container.appendChild( renderer_canvas );
            

var loader = new THREE.JSONLoader();
              loader.load( "assets/robot.js", createScene );

var clock = new THREE.Clock();

function createScene(geometry){
//    geometry.materials[ 0 ].shading = THREE.FlatShading;
//    var material = new THREE.MeshFaceMaterial();
//    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var mesh = new THREE.Mesh( geometry, material );
    THREE.AnimationHandler.add( geometry.animation );
    var animation = new THREE.Animation( mesh, "walk" );
    scene.add( mesh );
    animation.play();
}

    stats = new Stats();
    var stats_element = stats.domElement;
    dom_class.add( stats_element, 'stats' );
    container.appendChild( stats_element );

    function bounds(){
        return [Math.floor(center.x - w/2), Math.ceil(center.y - h/2), Math.floor(center.x + w/2),Math.ceil(center.y + h/2)];
    }
    
    
    //needs to be global for requestAnimationFrame
    animate = function(){
            var delta = clock.getDelta();
            THREE.AnimationHandler.update( delta );
            render();
            stats.update();
            requestAnimationFrame( animate );
    }
    requestAnimationFrame( animate );

    function render(){
            camera.lookAt( scene.position );
    
            var container = [];
            function f(object){
                container.push(object);
            }
            
            var b = bounds();
            objects.area_get(b, f);


            renderer.render( scene, camera );


    }

    function resize(){
        var w = container.offsetWidth;
        var h = container.offsetHeight;
        camera.left = w / - 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = h / - 2;

        camera.updateProjectionMatrix();

        renderer.setSize( w, h );
    }

    return {
        set_center: function(v){
            center = v;
        },
        resize: resize
    }
});
