include("Identifyable");
include("WebGLEngine");

include("geometry/Cube");
include("geometry/Vector3");

include("App");

include("util/FileLoader");
include("geometry/GeometryBuilder");

const SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
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
    var crateImageFile = loader.addImageFile("binaries/crate.jpg");
    var grassImageFile = loader.addImageFile("binaries/grass.jpg");

    // Load files, start app
    loader.load(function() {

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

        var cube = new Cube();
        var crateTexture = new WebGLEngine.Texture(crateImageFile.image);

        var object1 = new WebGLEngine.Object(cube, crateTexture);
        object1.transform.setTranslation(new Vector3(0, 0.5, 0));
        engine.addObject(object1);

        var grassTexture = new WebGLEngine.Texture(grassImageFile.image);
        var surface1 = new WebGLEngine.Object(GeometryBuilder.getSurface(8), grassTexture);
        surface1.transform.setScale(new Vector3(16, 16, 1));
        surface1.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));
        surface1.transform.setTranslation(new Vector3(-8, 0, 8));
        engine.addObject(surface1);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            engine.camera.setAspectRatio(canvas.width / canvas.height);
            engine.camera.updateMatrix();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
        resizeCanvas();

        var resizingTimeout;
        window.addEventListener("resize", function() {
            clearTimeout(resizingTimeout);
            resizingTimeout = setTimeout(resizeCanvas, 250);
        });

        let app = new App(engine);
        function renderLoop() {
            app.stepTime();
            engine.drawObjects();
            setTimeout(function() {
                requestAnimationFrame(renderLoop);
            }, 1000 / 60);
        }
        renderLoop();

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
    });
}
