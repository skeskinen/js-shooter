
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')
  ,requirejs = require('requirejs')
  ,fs = require('fs');

var app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);
io.set('log level', 1);

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../modules')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/death', routes.death);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    baseUrl: path.join(__dirname, '../modules'),

    nodeRequire: require
});

requirejs(['shooter/vector', 'shooter/constants'],
function(vector, C) {

    object_counter = 1;
    objects = new Array();

    function get_object(id){
        return _(objects).find(function(object){
            return object.id === id;
        });
    }

    function Human(socket) {
        this.type = C.TYPE_HUMAN;
        this.socket = socket;
        this.id = object_counter++;
    }

    Human.prototype.data = function() {
        return {type: this.type, loc: this.loc, id: this.id};
    }

    io.sockets.on('connection', function(socket){
        var object = new Human(socket);
        objects.push(object);
        socket.set('object', object);
        
        object.loc = { lat: 60.169864, lng: 24.938268 };
        
        
        socket.set('id', object_counter++);
        socket.emit('spawn_player', object.data());
        
        _(objects).each(function(o){
            socket.emit('spawn', o.data());
        });

        socket.broadcast.emit('spawn', object.data());

        socket.on('angle', function(angle){
            object.angle = angle;
        });

        socket.on('shoot', function(shooting){
            
        });

        socket.on('terrain', function(data){

        });
       
        socket.on('move_dir', function(data){
            object.move_dir = vector(data.x, data.y).unit();
        });

        socket.on('disconnect', function(){
            socket.broadcast.emit('remove', object.id);
            objects = _(objects).without(object);
        });
    });

    function update() {
        var location_table = new Array();
        _(objects).each(function(object){
            location_table.push({id: object.id, loc: object.loc});
        });
        _.each(_(objects).filter(function(object){
            return object.type === C.TYPE_HUMAN;
        }), function(human){
            human.socket.emit('update', location_table);
        });
        setTimeout(update, 100);
    }

    setTimeout(update, 100);
});

