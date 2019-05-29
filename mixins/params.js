exports.getParams = function(_global, _callback) {
    if (!_global.opts) _global.opts = {};

    _global.opts = {
        title      : "Title",
        description: "Hello world",

        // Route
        errorRoute  : '/test',

        // Components
        components: {
            css: [],
            js: [
                "/jquery/jquery.min.js"
            ]
        }
    };

    // Callback
    if (_callback) _callback();
}