/*
 *  All constants and magic numbers.
 */

define(function(){
    var zoom = 18;
    var exp_zoom = Math.pow(2,zoom);
    var world_size = 256 * exp_zoom;

    var listeners_level_limit = 13;
    var listeners_tile_size = world_size / Math.pow(2,13);

    return {
        //object types
        TYPE_HUMAN: 1,
        TYPE_NPC: 2,
        TYPE_PLAYER: 3,
        TYPE_NO_TYPE: 10,

        //terrain types
        TERRAIN_ROAD: 1,
        TERRAIN_LAND: 2,
        TERRAIN_WATER: 3,

        //world size constants
        WORLD_SIZE: world_size,
        ZOOM: zoom,
        EXP_ZOOM: exp_zoom,
        EARTH_RADIUS: 6378.137,

        //objects containing quadtree constants
        OBJECTS_LEAF_LIMIT: 32,
        OBJECTS_LEVEL_LIMIT: 18,

        //listeners containing quadtree constants
        LISTENERS_LEVEL_LIMIT: listeners_level_limit,
        LISTENERS_TILE_SIZE: listeners_tile_size,

        //event delay from client to execution, optimally should be latency x 2
        EVENT_DELAY: 100,
        //if event sending client is lagging, delay is atleast this
        EVENT_DELAY_LOW_LIMIT: 30,

        //event types
        EVENT_SPAWN: 1,
        EVENT_MOVE: 2,

        //object roles
        ROLE_MOVE: 0,
        ROLE_DRAW: 1,
        //max is always last role +1
        ROLE_MAX: 2

    }
});

