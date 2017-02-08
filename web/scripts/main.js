include("util/FileLoader");
include("Identifyable");

include("WebGLEngine");
include("Cube");
include("Pyramid");
include("ViewController");

const SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};

const SHADER_VARIABLES = {
    POSITION: "position",
    TEXTURE_COORD: "textureCoord",
    USE_COLOR: "useColor",
    MV_MATRIX: "mvMatrix",
    SAMPLER: "sampler",
    COLOR: "color"
};

function main() {

    // Setup web page
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(""));
    style.sheet.insertRule("body {padding:0px; margin:0px; overflow:hidden;}", 0);
    style.sheet.insertRule("canvas {padding:0px; margin:0px;}", 0);

    // Create file loader
    var loader = new FileLoader();

    // Load shaders
    var shaderFiles = {};
    for (var i in SHADER_FILENAMES) {
        shaderFiles[SHADER_FILENAMES[i]] = loader.addTextFile(SHADER_FILENAMES[i]);
    }

    // Load texture
    var crateWallImage = loader.addImageFile("binaries/crate.jpg");


    // Load files, start app
    loader.load(function () {

        // Create canvas
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);

        var gl = canvas.getContext("webgl");
        var engine = new WebGLEngine(gl);
        engine.initialize(
                shaderFiles[SHADER_FILENAMES.VSHADER].text,
                shaderFiles[SHADER_FILENAMES.FSHADER].text
                );

        var object1 = new WebGLEngine.Object(new Cube());
        object1.transform.setTranslation(new Vector3(0, 0, 0));

        var object2 = new WebGLEngine.Object(new Cube());
        object2.transform.setTranslation(new Vector3(0, 3, 0));
        object2.transform.setRotation(new Vector3(Math.PI / 2, 0, -Math.PI / 2));

        var object3 = new WebGLEngine.Object(new Pyramid());
        object3.transform.setTranslation(new Vector3(0, 3, 0));

        engine.addObject(object1);
        object1.add(object2);
        object2.add(object3);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            engine.camera.setAspectRatio(canvas.width / canvas.height);
            engine.camera.updateMatrix();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
        resizeCanvas();

        var resizingTimeout;
        window.addEventListener("resize", function () {
            clearTimeout(resizingTimeout);
            resizingTimeout = setTimeout(resizeCanvas, 250);
        });

        var cameraPos = new Vector3(0, 0, 12);
        engine.camera.setTranslation(cameraPos);

        var viewController = new ViewController(engine.camera);

        var rotY = 0;
        function renderLoop() {
//            rotY += .01;
//            object1.transform.setRotation(new Vector3(0, rotY, 0));
//            object3.transform.setRotation(new Vector3(rotY/2, 0, 0));
            viewController.update();
            engine.drawObjects();
            setTimeout(function () {
                requestAnimationFrame(renderLoop);
            }, 1000 / 60);
        }
        renderLoop();

        canvas.requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock;

        document.exitPointerLock = document.exitPointerLock ||
                document.mozExitPointerLock;

        canvas.addEventListener("click", function () {
            canvas.requestPointerLock();
        }, false);

        function lockChange() {
            if (document.pointerLockElement === canvas ||
                    document.mozPointerLockElement === canvas) {
                viewController.enable();
            } else {
                viewController.disable();
            }
        }
        document.addEventListener('pointerlockchange', lockChange, false);
        document.addEventListener('mozpointerlockchange', lockChange, false);
    });
}
