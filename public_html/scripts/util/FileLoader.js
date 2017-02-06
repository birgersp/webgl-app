class FileLoader {

    constructor() {

        this.files = [];
    }

    /**
     *
     * @param {String} filename
     * @return {FileLoader.Text}
     */
    addTextFile(filename) {

        var file = new FileLoader.Text(filename);
        this.files.push(file);
        return file;
    }

    /**
     *
     * @param {String} filename
     * @return {FileLoader.Image}
     */
    addImageFile(filename) {

        var file = new FileLoader.Image(filename);
        this.files.push(file);
        return file;
    }

    /**
     * @param {String} name
     * @param {Function} callback
     */
    loadFile(name, callback) {
        var loader = this;
        var request = new XMLHttpRequest();
        var origin = (window.location.origin + window.location.pathname);
        var path = origin.substring(0, origin.lastIndexOf("/") + 1);
        var fullUrl = path + name;
        request.open('GET', fullUrl);
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status === 200 || request.status === 'OK') {
                    callback(request.responseText);
                } else {
                    loader.throwFileNotFoundError(name);
                }
            }
        };
        request.send();
    }

    /**
     * @param {Function} callback
     */
    load(callback) {

        var loader = this;
        var files = this.files;
        var index = -1;

        function loadFileLoop() {
            index++;
            if (index < files.length) {
                var file = files[index];
                if (file instanceof FileLoader.Text) {
                    loader.loadFile(file.name, function(text) {
                        file.text = text;
                        loadFileLoop();
                    });
                } else
                if (file instanceof FileLoader.Image) {
                    file.image.onload = function() {
                        loadFileLoop();
                    };
                    file.image.onerror = function() {
                        loader.throwFileNotFoundError(file.name);
                    };
                    file.image.src = file.name;
                }
            } else {
                callback();
            }
        }
        loadFileLoop();
    }

    /**
     * @param {String} name
     */
    throwFileNotFoundError(name) {
        throw new Error("File \"" + name + "\" not found");
    }
}

FileLoader.File = class {

    constructor(name) {

        this.name = name;
    }
};

FileLoader.Text = class extends FileLoader.File {
    /** @member {String} text */
};

FileLoader.Image = class extends FileLoader.File {

    /**
     * @member {Image} image
     */

    constructor(name) {

        super(name);
        this.image = new Image();
    }
};
