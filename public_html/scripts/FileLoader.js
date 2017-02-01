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
     * @param {Function} callback
     */
    load(callback) {

        var files = this.files;

        var index = -1;
        function loadFileLoop() {
            index++;
            if (index < files.length) {
                var file = files[index];
                if (file instanceof FileLoader.Text) {
                    loadFile(file.name, function(text) {
                        file.text = text;
                        loadFileLoop();
                    });
                } else
                if (file instanceof FileLoader.Image) {
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
