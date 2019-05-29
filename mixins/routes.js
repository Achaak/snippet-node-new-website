exports.createPath = function(_global, _callback) {

    _event = 'createBuild:filesPath:get:controller';
    _global.tools.getFiles(_global, _global.path.join(__dirname, "../www/src"), "js", opts = { recursive: true, event: _event, filesName:["controller"] });
    _global.emitEvent.once(_event, (_filesPath) => {
        for (let i = 0; i < _filesPath.length; i++) {
            // Init variable
            _file   = _global.path.join(_filesPath[i].folder, '/'+_filesPath[i].file);
            _folder = _filesPath[i].folder;

            _js = require(_file);

            _opts = _js.getOpts(_global);

            // Chargement des pages
            _global.app.get(_opts.route, function(req, res) {
                // Init variable
                var _page = _global.path.join(_folder.replace(_global.path.join(__dirname, "../www/src/views/"), ""), '/index');
                

                // Render page
                res.render(_global.path.join(_folder.replace(_global.path.join(__dirname, "../www/src/views/"), ""), "/index.jade"), function(err, html) {
                    // Set parameters
                    _opts = _global._.extend({
                        pathJS : _global.path.join(_folder.replace(_global.path.join(__dirname, "../www"), "").replace("src", "build"), "/product.min.js"),
                        pathCSS: _global.path.join(_folder.replace(_global.path.join(__dirname, "../www"), "").replace("src", "build"), "/product.min.css"),
                        html   : html,
                    }, _opts);

                    
                    _opts = _global._.extend(_global.opts.pageContent, _opts);

                    res.render("main", {opts: _opts});
                });
        
                pageLoad(_page);
            });
        }
        
        // Error path
        _global.app.use(function(req, res, next){
            res.redirect(_global.opts.errorRoute);
        });

        // Callback
        if (_callback) _callback();
    });

    // Static files
    _global.app.use(_global.express.static(_global.path.join(__dirname + '/../www/')));

    console.log("[ROUTES]  Routes is created")
}


function pageLoad(_page) {
    console.log(("[SERVER]  Connexion to : "+_page).blue);
}