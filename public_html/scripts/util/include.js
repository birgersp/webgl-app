/**
 * include.js
 * By Birger Skogeng Pedersen (birgersp)
 */

/**
 * Add a file to the list of script includes
 * @param {String} name
 */
function include(name) {

    var fixedName = (include.prefix + name).replace(/\/.*?\/\.\./g, "");
    if (include.files.indexOf(fixedName) === -1)
        include.files.push(fixedName);
}

include.filesLoaded = 0;
include.files = [];
include.headElement;
include.prefix = "";

// Initialize and start including
(function () {

    include.headElement = document.getElementsByTagName("head")[0];

    var mainScript;
    var scriptElements = document.getElementsByTagName("script");
    for (var i = 0; !mainScript && i < scriptElements.length; i++) {
        var script = scriptElements[i];
        if (script.hasAttribute("src") && script.hasAttribute("data-main"))
            mainScript = script.getAttribute("data-main");
    }

    if (!mainScript)
        throw new Error("Main script not defined.");

    function loadScript(name) {
        include.prefix = "";
        var prefixNameSplit = name.split("/");
        var noOfPrefixes = prefixNameSplit.length - 1;
        for (var i = 0; i < noOfPrefixes; i++)
            include.prefix += prefixNameSplit[i] + "/";

        var scriptElement = document.createElement("script");
        scriptElement.setAttribute("src", name + ".js");
        scriptElement.onload = function () {
            include.filesLoaded++;
            if (include.filesLoaded < include.files.length)
                loadScript(include.files[include.filesLoaded]);
            else {
                if (window.main === null || typeof window.main !== "function") {
                    throw new Error("Could not invoke function \"main\"");
                }
                main();
            }
        };
        scriptElement.onerror = function (evt) {
            throw new Error("Could not load script \"" + name + ".js\"");
        };
        include.headElement.appendChild(scriptElement);
    }

    include(mainScript);
    loadScript(mainScript);
})();
