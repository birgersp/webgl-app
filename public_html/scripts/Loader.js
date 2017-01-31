class Loader {

    constructor() {

        this.files = [];
    }

    /**
     * 
     * @param {String} filename
     * @return {Loader.Text}
     */
    addTextFile(filename) {

        var file = new Loader.Text(filename);
        this.files.push(file);
        return file;
    }

    /**
     * 
     * @param {String} filename
     * @param {Number} w
     * @param {Number} h
     * @return {Loader.Image}
     */
    addImageFile(filename, w, h) {

        var file = new Loader.Image(filename, w, h);
        this.files.push(file);
        return file;
    }

    /**
     * @param {Function} callback
     */
    load(callback) {

        var files = this.files;

        var index = -1;
        function loadFileLoop() {
            index++;
            if (index < files.length) {
                var file = files[index];
                if (file instanceof Loader.Text) {
                    loadFile(file.name, function(text) {
                        file.text = text;
                        loadFileLoop();
                    });
                } else
                if (file instanceof Loader.Image) {
                    file.image.onload = function() {
                        loadFileLoop();
                    };
                    file.image.src = file.name;
                }
            } else {
                callback();
            }
        }
        loadFileLoop();
    }
}

Loader.File = class {

    constructor(name) {

        this.name = name;
    }
};

Loader.Text = class extends Loader.File {
    /** @member {String} text */
};

Loader.Image = class extends Loader.File {

    /**
     * @member {Image} image
     */
    
    constructor(name, w, h) {
        
        super(name);
        this.image = new Image(w, h);
    }
};
