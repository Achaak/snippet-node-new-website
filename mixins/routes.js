exports.createPath = function(_global) {
    // Chargement des pages
    _global.app.get('/', function(req, res) {
        // Init variable
        var _page = 'home/index';

        res.render(_page);

        pageLoad(_page);
    });

    // Static files
    _global.app.use(_global.express.static(__dirname + '/www/public/'));

    _global.app.use(function(req, res, next){
        var _page = 'home/index';

        res.render(_page);
    });
}


function pageLoad(_page) {
    console.log(("[SERVER]  Connexion to : "+_page).blue);
}