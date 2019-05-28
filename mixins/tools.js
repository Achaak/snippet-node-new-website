exports.getFiles = (_global, _folder, _extention, _opts) => {
    // Extend parameters
    _opts = _global._.extend({
        recursive: true,
        event: 'tools:filesPath:get'
    }, _opts)

    getFiles(_global, _folder, _extention, _opts)
        .then( (_files) => {
            _global.emitEvent.emit(_opts.event, _files);
        });
}


async function getFiles(_global, _folder, _extention, _opts, _filesList = []) {
    // Get files and folders
    var _files = await _global.fs.readdirSync(_folder);

    for (let i = 0; i < _files.length; i++) {
        _file = _files[i];
        
        _split = _file.split(".")

        if (_split.length == 1 && _global.fs.lstatSync(_folder).isDirectory() && _opts.recursive) {
            try {
                await getFiles(_global, _folder+"/"+_file, _extention, _opts, _filesList)
            }
            catch(e) {}
        }
        else if (_global._.last(_split) == _extention)
            _filesList.push({
                folder: _folder,
                file: _file
            });
    }

    return _filesList;
}