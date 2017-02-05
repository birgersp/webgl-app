const DEPENDENCIES = ["FileLoader", "WebGLEngine", "Matrix4", "Cube", "Vector3", "Transform"];

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
    style.sheet.insertRule("body {padding:0px; margin:0px;}", 0);
    style.sheet.insertRule("canvas {"
            + "padding:0px; margin:0px;"
            + "width:100%; height:100%;"
            + "}", 0);

    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);
    var onResize = function () {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    onResize();

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

        var gl = canvas.getContext("webgl");
        var engine = new WebGLEngine(gl);
        engine.initialize(
                shaderFiles[SHADER_FILENAMES.VSHADER].text,
                shaderFiles[SHADER_FILENAMES.FSHADER].text
                );

        var object1 = new WebGLEngine.Object(new Cube());
        object1.transform.setTranslation(new Vector3(0.5, 0, 0));
        engine.addObject(object1);

        var rot = 0.1;
        function renderLoop() {
            rot += 0.01;
            object1.transform.setRotation(new Vector3(rot/3, rot, 0));
            engine.drawObjects();
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
    });
}

require(DEPENDENCIES, main);
