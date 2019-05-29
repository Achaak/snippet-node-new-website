exports.getParams = function(_global) {
    if (!_global.opts) _global.opts = {};
    
    // Path
    _global.opts.errorPath = 'home/index';

    // Components
    _global.opts.components = {};
    _global.opts.components.css = [];
    _global.opts.components.js  = [
        "/jquery/jquery.min.js"
    ];
}