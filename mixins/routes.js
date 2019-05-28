exports.createPath = function(_global) {

    _event = 'createBuild:filesPath:get:route';
    _global.tools.getFiles(_global, _global.path.join(__dirname, "../www/src"), "route", opts = { recursive: true, event: _event });
    _global.emitEvent.once(_event, (_filesPath) => {
        for (let i = 0; i < _filesPath.length; i++) {
            // Init variable
            _file   = _global.path.join(_filesPath[i].folder, '/'+_filesPath[i].file);
            _folder = _filesPath[i].folder;

            // Chargement des pages
            _global.app.get(_global.fs.readFileSync(_file, "utf8"), function(req, res) {
                // Init variable
                var _page = _global.path.join(_folder.replace(_global.path.join(__dirname, "../www/src/views/"), ""), '/index');
        
                res.render(_page);
        
                pageLoad(_page);
            });
        }
        
        // Error path
        _global.app.use(function(req, res, next){
            res.render(_global.opts.errorPath);
        });
    });

    // Static files
    _global.app.use(_global.express.static(__dirname + '/www/public/'));

}


function pageLoad(_page) {
    console.log(("[SERVER]  Connexion to : "+_page).blue);
}