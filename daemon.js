var global = {};

global.builder = require("./mixins/builder.js");
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
global.reload    = require("reload");

global.app    = global.express();
global.server = global.http.createServer(global.app);

// Emit event
const EventEmitter = require('events')
global.emitEvent = new EventEmitter();



// Defind template
global.app.set('views', './www/src/views');
global.app.set('view engine', 'jade');


// Prepare the server
prepareServer()


// Function to prepare the server
async function prepareServer() {
    // Get all server params
    await global.params.getParams(global);
    
    // Create the build
    await global.builder.createBuild(global);
        
    // Create all path
    await global.routes.createPath(global);

    startServer();
}


// Function to start the server
function startServer() {
    // Create the server
    global.server = global.http.createServer(global.app);

    global.server.listen(
        8081, 
        () => console.log("[SERVER]  -- Server is started ! --".green)
    );

    global.reload(global.app);
}
