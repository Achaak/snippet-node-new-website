exports.createPath = async function(_global, _callback) {

    var _controllerFiles = await _global.tools.getFiles(_global.path.join(__dirname, "../www/src"), "js", opts = { recursive: true, filesName:["controller"] });
    
    for (let i = 0; i < _controllerFiles.length; i++) {
        // Init variable
        _file   = _global.path.join(_controllerFiles[i].folder, '/'+_controllerFiles[i].file);
        _folder = _controllerFiles[i].folder;

        _js = require(_file);

        _opts = _js.getOpts(_global);

        // Chargement des pages
        await _global.app.get(_opts.route, function(req, res) {
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

        console.log("[ROUTES] ", _opts.route)
    }

    // Static files
    _global.app.use(_global.express.static(_global.path.join(__dirname + '/../www/')));
    
    // Error path
    _global.app.get('*', function(req, res){
        res.redirect(_global.opts.errorRoute);
    });

    console.log("[ROUTES]  Routes is created".green)

    // Callback
    if (_callback) _callback();
}


function pageLoad(_page) {
    console.log(("[SERVER]  Connexion to : "+_page).blue);
}