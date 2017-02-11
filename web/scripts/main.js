include("Identifyable");
include("WebGLEngine");

include("geometry/Cube");
include("geometry/Vector3");

include("App");

include("util/FileLoader");
include("geometry/GeometryBuilder");

function main() {

    // Setup web page
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(""));
    style.sheet.insertRule("body {padding:0px; margin:0px; overflow:hidden;}", 0);
    style.sheet.insertRule("canvas {padding:0px; margin:0px;}", 0);

    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    let app = new App(canvas.getContext("webgl"));

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        app.engine.camera.setAspectRatio(canvas.width / canvas.height);
        app.engine.camera.updateMatrix();
        app.engine.setViewPort(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();

    var resizingTimeout;
    window.addEventListener("resize", function() {
        clearTimeout(resizingTimeout);
        resizingTimeout = setTimeout(resizeCanvas, 250);
    });

    document.addEventListener("mousemove", function(evt) {
        app.controller.mouseMoved(evt.movementX, evt.movementY);

    }, false);
    document.addEventListener("keydown", function(evt) {
        app.controller.keyDown(evt.key.toLowerCase());
    }, false);
    document.addEventListener("keyup", function(evt) {
        app.controller.keyUp(evt.key.toLowerCase());
    }, false);

    canvas.requestPointerLock = canvas.requestPointerLock ||
            canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
            document.mozExitPointerLock;

    canvas.addEventListener("click", function() {
        canvas.requestPointerLock();
    }, false);

    function lockChange() {
        if (document.pointerLockElement === canvas ||
                document.mozPointerLockElement === canvas) {
            app.resume();
        } else {
            app.pause();
        }
    }
    document.addEventListener('pointerlockchange', lockChange, false);
    document.addEventListener('mozpointerlockchange', lockChange, false);
    app.start();

    // Demo

    let i = 0;
    let terrainSize = 12;
    let terrainCoordinates = new Array(Math.pow(terrainSize + 1, 2));
    for (let z = 0; z <= terrainSize; z++)
        for (let x = 0; x <= terrainSize; x++){
            let coordinate = new Vector3(x - terrainSize / 2, 0, z - terrainSize / 2);
            terrainCoordinates[i++] = coordinate;
        }
    app.setTerrainMesh(terrainCoordinates);
}
