function loadFile(url, callback) {
    var client = new XMLHttpRequest();
    var loaded = false;
    var origin = (window.location.origin + window.location.pathname);
    var path = origin.substring(0, origin.lastIndexOf("/") + 1);
    var fullUrl = path + url;
    console.log(fullUrl);
    client.open('GET', fullUrl);
    client.onreadystatechange = function () {
        if (client.readyState == 4) {
            callback(client.responseText);
        }
    };
    client.send();
}

function loadFiles(files, callback) {

    var loadedStrings = [];
    while (loadedStrings.length < files) {
        loadedStrings.push("");
    }

    function fileLoaded(index) {
        for (var i in loadedStrings) {
            if (loadedStrings[i] === "") {
                return;
            }
        }
        callback(loadedStrings);
    }

    for (var i in files) {
        var index = i;
        loadFile(files[index], function () {
            fileLoaded(index);
        });
    }
}
