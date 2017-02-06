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
            else
                main();
        };
        include.headElement.appendChild(scriptElement);
    }

    if (mainScript) {
        include(mainScript);
        loadScript(mainScript);
    }
})();
