
define(["shooter/constants", "shooter/vector", "shooter/object_modules", "shooter/objects"], function(C, vector, object_modules, objects){

    /*
     *  Creates new Game_object and adds it to shooter/objects.
     *  Almost everything is game_object: players, items, npcs.
     *  Game_objects don't do a lot of things themselves but use 
     *  roles and modules.
     */

    var Game_object = function(id, pos, type){
        this.id = id;
        this.pos = pos;
        this.type = type;
        
        this.roles = []
        this.modules = [];
        this.init_roles();

        /*
         * objects_area contains borders of objects tile. Used when moving object.
         * Set by shooter/objects.
         */
        this.objects_area = [];
        
        objects.add_object(this);
    };

    /*
     * Initializes objects roles. Roles define what object can do and how 
     * it interacts with its surroundings. For example object with role move
     * can move. What happens when it moves depends on it's move module.
     * Initializes role and module tables. Then gets default modules for
     * current object type and sets them.
     */

    Game_object.prototype.init_roles = function(){
        for(var i=0; i<C.ROLES_MAX; ++i){
            this.roles.push(false);
            this.modules.push({});
        }
        
        var default_modules = object_modules.default_modules(this.type);
        for(var i = 0, len = default_modules.length; i < len; ++i){
            this.set_module(default_modules[i][0], default_modules[i][1], []);
        }

    }
    
    /*
     * Function used to set roles and modules for object.
     * Calls module specified by second parameter. Third parameter is array
     * given to module as argument.
     */

    Game_object.prototype.set_module = function(role, module, args){
        this.roles[role] = true;
        this.modules[role] = object_modules[module].apply(this, args);
    }

    return Game_object;
    
});

