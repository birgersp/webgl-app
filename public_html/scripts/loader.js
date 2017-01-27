var Loader = function () {

    this.files = [];

    this.add = function (filename) {
        this.files.push(new Loader.File(filename));
    };

    this.load = function (callback) {

        var files = this.files;

        var index = 0;
        function loadFileLoop() {
            if (index < files.length) {
                var file = files[index];
                loadFile(file.name, function (text) {
                    file.text = text;
                    index++;
                    loadFileLoop();
                });
            } else {
                callback();
            }
        }
        loadFileLoop();
    };
};

Loader.File = function (name) {
    this.name = name;
    this.text = "";
};
