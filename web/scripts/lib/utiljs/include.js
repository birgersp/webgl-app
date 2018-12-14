/**
 * include.js
 * By Birger Skogeng Pedersen (birgersp)
 */

/**
 * Adds a single file to be included.
 * @param {String} path A relative path to a script.
 */
function include(path) {

    var fixedName = (include.prefix + path).replace(/\/.*?\/\.\./g, "");

    for (let i in include.dependencies)
        if (include.dependencies[i].name === fixedName)
            return;

    include.dependencies.push(new include.Dependency(fixedName, include.currentInitiator));
}

/**
 * Adds an array of files to be included.
 * @param {String} paths An array of relative paths to scripts.
 */
include.all = function (paths) {

    for (let i in paths)
        include(paths[i]);
};

/**
 * Loads a single script to the page.
 * @param {Number} url Url of script file
 * @param {Function} onSuccess Callback invoked if script is loaded
 * @param {Function} onFail Callback invoked if script failed to load
 */
include.loadScript = function (url, onSuccess, onFail) {

    var element = document.createElement("script");
    element.setAttribute("src", url);

    if (onSuccess)
        element.onload = function () {
            onSuccess();
        };

    if (onFail)
        element.onerror = function (evt) {
            onFail();
        };

    document.head.appendChild(element);
};

/**
 * A script that's meant to be included in the inclusion process.
 */
include.Dependency = class {

    constructor(name, initiator) {

        this.name = name;
        this.initiator = initiator;
    }
};

include.dependencies = [];
include.currentInitiator = "";
include.prefix = "";

// Initialize and start including
window.addEventListener("load", function () {

    var mainScript;
    var scriptElements = document.getElementsByTagName("script");
    for (var i = 0; !mainScript && i < scriptElements.length; i++) {
        var script = scriptElements[i];
        if (script.hasAttribute("src") && script.hasAttribute("data-main"))
            mainScript = script.getAttribute("data-main");
    }

    if (!mainScript)
        throw new Error("Main script not defined.");

    function onLoad() {

        filesLoaded++;
        if (filesLoaded < include.dependencies.length)
            loadScript(include.dependencies[filesLoaded]);
        else {
            if (window.main === null || typeof window.main !== "function") {
                throw new Error("No main function");
            }
            main();
        }
    }

    let name = "";
    function onError() {

        throw new Error("Could not load script \"" + name + "\" initiated by \"" + include.currentInitiator + "\"");
    }

    var filesLoaded = 0;
    function loadScript(dependency) {
        name = dependency.name;
        include.prefix = "";
        var prefixNameSplit = name.split("/");
        var noOfPrefixes = prefixNameSplit.length - 1;
        for (var i = 0; i < noOfPrefixes; i++)
            include.prefix += prefixNameSplit[i] + "/";

        include.currentInitiator = name;
        include.loadScript(name, onLoad, onError);
    }

    include(mainScript);
    loadScript(new include.Dependency(mainScript, "root"));
});
