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

        app.engine.camera.updateMatrix();
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

    // Demo

    let noiseValues = {};
    function getNoise(x, z) {

        if (!noiseValues[x])
            noiseValues[x] = {};

        if (noiseValues[x][z] === undefined)
            noiseValues[x][z] = Math.random() * 2 - 1;

        return noiseValues[x][z];
    }

    function getSmoothNoise(x, z) {

        let corners = (getNoise(x + 1, z - 1) + getNoise(x - 1, z - 1) + getNoise(x - 1, z + 1) + getNoise(x + 1, z + 1)) / 16;
        let sides = (getNoise(x - 1, z) + getNoise(x + 1, z) + getNoise(x, z + 1) + getNoise(x, z - 1)) / 8;
        let center = getNoise(x, z) / 4;
        return (corners + sides + center);
    }

    function interpolate(a, b, blend) {

        let theta = blend * Math.PI;
        let f = (1 - Math.cos(theta)) * 0.5;
        return a * (1 - f) + b * f;
    }

    function getInterpolatedNoise(x, z) {

        let intX = Math.floor(x);
        let intZ = Math.floor(z);
        let fracX = x - intX;
        let fracZ = z - intZ;

        let v1 = getSmoothNoise(intX, intZ);
        let v2 = getSmoothNoise(intX + 1, intZ);
        let v3 = getSmoothNoise(intX, intZ + 1);
        let v4 = getSmoothNoise(intX + 1, intZ + 1);

        let i1 = interpolate(v1, v2, fracX);
        let i2 = interpolate(v3, v4, fracX);
        return interpolate(i1, i2, fracZ);
    }

    let amplitude = 25;
    function generateY(x, z) {

        return getInterpolatedNoise(x / 8, z / 8) * amplitude;
    }

    function getTerrain(xOffset, zOffset, size) {
        let i = 0;
        let terrainCoordinates = new Array(Math.pow(size + 1, 2));
        for (let z = 0; z <= size; z++)
            for (let x = 0; x <= size; x++) {
                let coordinate = new Vector3(xOffset + x - size / 2, 0, zOffset + z - size / 2);
                coordinate[1] = generateY(coordinate[0], coordinate[2]);
                terrainCoordinates[i++] = coordinate;
            }
        return terrainCoordinates;
    }

    function addTerrain() {

        let sections = 15;
        let sectionSize = 12;
        for (let z = -(sections / 2 - 1); z < sections / 2; z++)
            for (let x = -(sections / 2 - 1); x < sections / 2; x++) {
                app.setTerrainMesh(getTerrain(x * sectionSize, z * sectionSize, 12));
            }
    }

    app.load(function() {
        addTerrain();
        app.start();
    });
}
