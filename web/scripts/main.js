include("App.js");
include("util/TerrainGenerator.js");

function main() {

    // Setup web page
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(""));
    style.sheet.insertRule("body {padding:0px; margin:0px; overflow:hidden; background:black;}", 0);
    style.sheet.insertRule("canvas {padding:0px; margin:0px;}", 0);

    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    let app = new App(canvas.getContext("webgl"));

    let aspectRatio = 16 / 9;
    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let desiredHeight = width / aspectRatio;
        if (height > desiredHeight) { // Too high!
            height = desiredHeight;
        } else {
            width = height * aspectRatio;
        }

        let heightOffset = window.innerHeight - height;
        let widthOffset = window.innerWidth - width;

        app.engine.setViewPort(widthOffset / 2, heightOffset / 2, width, height);
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
        app.controller.keyDown(evt.keyCode);
    }, false);
    document.addEventListener("keyup", function(evt) {
        app.controller.keyUp(evt.keyCode);
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

    // Demo

    function addTerrain() {

        let size = 192;
        let offset = Math.floor(size / 2);

        let coordinates = {};
        let terrainGenerator = new TerrainGenerator();
        for (let j = 0; j <= size; j++) {
            let z = offset - j;
            for (let i = 0; i <= size; i++) {
                let x = i - offset;
                let coordinate = new Vector3(x, 0, z);
                coordinate[1] = terrainGenerator.generateY(coordinate[0], coordinate[2]);
                app.world.addTerrainCoordinate(coordinate);

                if (!coordinates[x])
                    coordinates[x] = {};

                coordinates[x][z] = coordinate;

                if (i > 0 && j > 0) {
                    let faceCoordinate = coordinate.getCopy();
                    faceCoordinate[0] -= .5;
                    faceCoordinate[2] += .5;
                    app.world.enableTerrainCell(faceCoordinate);
                }
            }
        }
    }
    app.initialize(function() {
        addTerrain();
        app.start();
    });
}
