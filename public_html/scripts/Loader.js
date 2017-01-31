class Loader {

    constructor() {

        this.files = [];
    }

    addTextFile(filename) {

        this.files.push(new Loader.TextFile(filename));
    }

    load(callback) {

        var files = this.files;

        var index = 0;
        function loadFileLoop() {
            if (index < files.length) {
                var file = files[index];
                if (file instanceof Loader.TextFile) {
                    loadFile(file.name, function(text) {
                        file.text = text;
                        index++;
                        loadFileLoop();
                    });
                }
            } else {
                callback();
            }
        }
        loadFileLoop();
    }
}

Loader.TextFile = class {

    constructor(name) {

        this.name = name;
        this.text = "";
    }
};
