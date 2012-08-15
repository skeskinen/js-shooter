define(function(){
    var world_size = 256;
    var zoom = 18;
    var pixel_size = world_size / Math.pow(2,zoom); 
    return {
        TYPE_HUMAN: 1,
        TYPE_NPC: 2,
        TYPE_PLAYER: 3,
        TYPE_NO_TYPE: 10,

        TERRAIN_ROAD: 1,
        TERRAIN_LAND: 2,
        TERRAIN_WATER: 3,


        WORLD_SIZE: world_size,
        ZOOM: zoom,
        PIXEL_SIZE: pixel_size,
        EARTH_RADIUS: 6378.137,

        QUADTREE_NODE_LIMIT: 20,
        QUADTREE_LEVEL_LIMIT: 18,

        EVENT_DELAY: 80
    }
});

