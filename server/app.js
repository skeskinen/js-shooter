
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
  app.use(express.cookieParser('your so really secret secret here'));
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
    baseUrl: path.join(__dirname, '../modules'),

    nodeRequire: require
});

requirejs(['server/user'],
function(User) {

    io.sockets.on('connection', function(socket){
        var user = new User(socket);
    });

});

