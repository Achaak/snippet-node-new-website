exports.createBuild = async (_global, _callback) => {
    // Defind event
    _event = 'createBuild:filesPath:get:jade';
    _global.tools.getFiles(_global, _global.path.join(__dirname, "../www/src"), "jade", opts = { recursive: true, event: _event, filesName: ["index"]});
    await _global.emitEvent.once(_event, (_filesPath) => {
        _global.rimraf(_global.path.join(__dirname, "../www/build"), async () => {
            // Function to minify the products files
            await createProductBuild(_global, _filesPath);

            // Function to minify the components files
            await createComponentsBuild(_global);
        });
    });


    console.log("[BUILDER] Build is created")
    
    // Callback
    if (_callback) _callback();
}


// ----
// -- PRODUCT
// ----
// Function to minify the products files
function createProductBuild(_global, _filesPath) {
    for (let i = 0; i < _filesPath.length; i++) {
        _folder = _filesPath[i].folder

        // Launch JS minifier
        _global.tools.getFiles(_global, _global.path.join(_folder, "/js"), "js", opts = { recursive: false, event: 'createBuild:filesPath:get:js' });

        // Launch SCSS minifier
        _global.tools.getFiles(_global, _global.path.join(_folder, "/scss"), "scss", opts = { recursive: false, event: 'createBuild:filesPath:get:scss' });
    }

    // Launch JS minifier event
    _global.emitEvent.on('createBuild:filesPath:get:js', (_filesPath) => {
        minifyProductJs(_global, _filesPath);
    });

    // Launch SCSS minifier event
    _global.emitEvent.on('createBuild:filesPath:get:scss', (_filesPath) => {
        minifyProductScss(_global, _filesPath);
    });

    // Launch SCSS minifier for main scss
    _global.tools.getFiles(_global,  _global.path.join(__dirname, "/../www/src/views/main/scss"), "scss", opts = { recursive: false, event: 'createBuild:filesPath:get:scss' });
}


// Function to minify the JS in product file
function minifyProductJs(_global, _filesPath) {
    // Defind files content
    var _filesContent = {};
    for (let i = 0; i < _filesPath.length; i++) {
        _filesContent["file"+i] = _global.fs.readFileSync(_global.path.join(_filesPath[i].folder, "/"+_filesPath[i].file), "utf8");
    }

    // Minify files
    var _minify = _global.uglifyJS.minify(_filesContent);

    // Create folder
    _global.fs.mkdir(_global.path.join(_global._.first(_filesPath).folder.replace("src", "build"), ".."), { recursive: true }, (_err) => {
        // Create file
        _global.fs.writeFileSync(_global.path.join(_global._.first(_filesPath).folder.replace("src", "build"), "../product.min.js"), _minify.code, "utf8");
    });
}


// Function to minify the SCSS in product file
async function minifyProductScss(_global, _filesPath) {
    // Event for minify all css
    var _cssPathList = [];
    var _nbRandom    = Math.random();

    _global.emitEvent.once("minify:css:"+_nbRandom, () => {
        // Minify css
        var uglified = _global.uglifycss.processFiles(
            _cssPathList,
            { maxLineLen: 500, expandVars: true }
        );

        // Write the minify css
        _global.fs.writeFile(_global.path.join(_global._.first(_filesPath).folder.replace("src", "build").replace("scss", "css"), "../product.min.css"), uglified, function(err){
    
            // Delete css file
            for (let i = 0; i < _cssPathList.length; i++) {
                _global.rimraf(_cssPathList[i], function () {});
            }
        });
    });


    for (let i = 0; i < _filesPath.length; i++) {
        // Compile scss file
        _global.sass.render({
            file: _global.path.join(_filesPath[i].folder, "/"+_filesPath[i].file)
        }, function(err, result) {
            var _filePath = _filesPath[i];

            // If error
            if (err) return console.log("[ERROR] "+ JSON.stringify(err).red);

            // Create folder
            _global.fs.mkdir(_global.path.join(_filePath.folder.replace(/scss/g, "css").replace("src", "build"), ".."), { recursive: true }, (_err) => {

                // Create file
                var _cssPath = _global.path.join((_filePath.folder+"/"+_filePath.file).replace(/scss/g, "css").replace("src", "build"), "..");
                _global.fs.writeFile(_cssPath, result.css, function(err){

                    if (err) return console.log("[ERROR] "+ JSON.stringify(err).red);
                    
                    // Add css path on the list
                    _cssPathList.push(_cssPath);

                    // If the last scss is compile
                    if (i == _filesPath.length-1) {
                        _global.emitEvent.emit("minify:css:"+_nbRandom);
                    }
                });
            });
        });
    }

    
}


// ----
// -- COMPONENT
// ----
// Function to minify the components files
async function createComponentsBuild(_global) {
    await minifyComponentsJs(_global);
    await minifyComponentsCss(_global);
}

// Function to minify the JS in component file
function minifyComponentsJs(_global) {
    // Defind files content
    var _filesContent = {};
    for (let i = 0; i < _global.opts.components.js.length; i++) {
        _filePath = _global.path.join(__dirname, "../www/components", _global.opts.components.js[i]);
        _filesContent["file"+i] = _global.fs.readFileSync(_global.path.join(_filePath), "utf8");
    }

    // Minify files
    var _minify = _global.uglifyJS.minify(_filesContent);

    // Create folder
    _global.fs.mkdir(_global.path.join(__dirname, "../www/build"), { recursive: true }, (_err) => {
        // Create file
        _global.fs.writeFileSync(_global.path.join(__dirname, "../www/build", "/components.min.js"), _minify.code, "utf8");
    });
}

// Function to minify the css in component file
function minifyComponentsCss(_global) {
    // Foramt css path
    for (let i = 0; i < _global.opts.components.css.length; i++) {
        _global.opts.components.css[i] = _global.path.join(__dirname, "../www/build", _global.opts.components.css[i]);
    }

    // Minify css
    var uglified = _global.uglifycss.processFiles(
        _global.opts.components.css,
        { maxLineLen: 500, expandVars: true }
    );

    // Write the minify css
    _global.fs.writeFile(_global.path.join(__dirname, "../www/build", "/components.min.css"), uglified, function(err){});
}