var global = {};

// Defind parameters
global.dev = true

global.builder = require("./builder.js");
global.routes  = require("./mixins/routes.js");
global.tools   = require("./mixins/tools.js");
global.params  = require("./mixins/params.js");

global.http      = require('http');
global.fs        = require('fs');
global.express   = require('express');
global.colors    = require('colors');
global._         = require('lodash');
global.uglifyJS  = require('uglify-js');
global.uglifycss = require("uglifycss");
global.sass      = require('node-sass');
global.rimraf    = require("rimraf");
global.path      = require("path");

global.app    = global.express();
global.server = global.http.createServer(global.app);

// Emit event
const EventEmitter = require('events')
global.emitEvent = new EventEmitter();



// Defind template
global.app.set('views', './www/src/views');
global.app.set('view engine', 'jade');


// get all server params
global.params.getParams(global);


//global.builder.createBuild(global);



// Create all path
global.routes.createPath(global);


// END
console.info("[SERVER]  -- Server is started ! --".green);

global.server.listen(8081);
