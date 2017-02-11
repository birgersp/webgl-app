include("Identifyable");
include("User");
include("WebGLEngine");
include("Controller");
include("util/FileLoader");

class App {

    constructor(gl) {

        this.controller = new Controller();

        this.terrainGeometry = new WebGLEngine.Geometry([], []);
        this.terrainCoordinates = {};
        this.user = new User();
        this.user.position = new Vector3(0, 4, 5);
        this.controller.rotation = new Vector3(0, 0, 0);
        this.engine = new WebGLEngine(gl);
        this.loader = new FileLoader();
    }

    stepTime() {

        this.user.velocity.add(App.GRAVITY_STEP);
        this.user.position.add(this.user.velocity);

        var bottomCenter = this.user.position.plus(User.BOTTOM_CENTER_POS);
        var topCenter = this.user.position.plus(User.TOP_CENTER_POS);

        this.controller.update();
        if (this.isBelowTerrain(bottomCenter) && !this.isBelowTerrain(topCenter)) {
            this.user.position[1] = -User.BOTTOM_CENTER_POS[1];
            this.user.velocity = this.controller.velocity;
            this.user.velocity.scale(0.1);
        }

        var topCenter = this.user.position.plus(User.TOP_CENTER_POS);
        this.engine.camera.setTranslation(topCenter);
        this.engine.camera.setRotation(this.controller.rotation);
    }

    pause() {

        this.controller.disable();
    }

    resume() {

        this.controller.enable();
    }

    start() {

        // Create file loader
        var loader = new FileLoader();

        // Load shaders
        var shaderFiles = {};
        for (var i in App.SHADER_FILENAMES) {
            shaderFiles[App.SHADER_FILENAMES[i]] = loader.addTextFile(App.SHADER_FILENAMES[i]);
        }

        // Load texture
        var crateImageFile = loader.addImageFile("binaries/crate.jpg");
        var grassImageFile = loader.addImageFile("binaries/grass.jpg");

        let engine = this.engine;
        let app = this;
        loader.load(function() {
            engine.initialize(
                    shaderFiles[App.SHADER_FILENAMES.VSHADER].text,
                    shaderFiles[App.SHADER_FILENAMES.FSHADER].text
                    );

            var cube = new Cube();
            var crateTexture = new WebGLEngine.Texture(crateImageFile.image);

            var object1 = new WebGLEngine.Object(cube, crateTexture);
            object1.transform.setTranslation(new Vector3(0, 0.5, 0));
            engine.addObject(object1);

            var grassTexture = new WebGLEngine.Texture(grassImageFile.image);
            var terrainObject = new WebGLEngine.Object(app.terrainGeometry, grassTexture);
            engine.addObject(terrainObject);

            function renderLoop() {
                app.stepTime();
                engine.render();
                setTimeout(renderLoop, 1000 / 60);
            }
            renderLoop();
        });
    }

    setTerrainMesh(coordinates) {

        let size = Math.sqrt(coordinates.length);

        let vertices = new Float32Array(coordinates.length * Vertex.LENGTH);
        let indices = new Uint16Array(Math.pow(size - 1, 2) * 6);

        let vertexIndex = 0;
        let indexIndex = 0;
        for (let j = 0; j < size; j++)
            for (let i = 0; i < size; i++) {
                if (i > 0 && j > 0) {
                    let a = vertexIndex - size - 1;
                    let b = a + 1;
                    let c = vertexIndex - 1;
                    indices.set([a, vertexIndex, b, a, c, vertexIndex], indexIndex++ * 6);
                }

                let c = coordinates[vertexIndex];
                let vertex = new Vertex(c[0], c[1], c[2], i/2, j/2);
                vertices.set(vertex, vertexIndex++ * Vertex.LENGTH);

                let xIndex = Math.floor(c[0]);
                let zIndex = Math.floor(c[2]);
                if (!this.terrainCoordinates[xIndex])
                    this.terrainCoordinates[xIndex] = {};
                this.terrainCoordinates[xIndex][zIndex] = c;
            }
        this.terrainGeometry.vertices = vertices;
        this.terrainGeometry.indices = indices;
        this.engine.bufferGeometry(this.terrainGeometry);
    }

    isBelowTerrain(coordinate) {

        let xIndex = Math.floor(coordinate[0]);
        let zIndex = Math.floor(coordinate[2]);
        let tc0 = this.terrainCoordinates[xIndex][zIndex];
        let tc1 = this.terrainCoordinates[xIndex + 1][zIndex];
        let tc2 = this.terrainCoordinates[xIndex][zIndex + 1];
        let tc3 = this.terrainCoordinates[xIndex + 1][zIndex + 1];
        let y = coordinate[1];
        return (y < tc0[1] && y < tc1[1] && y < tc2[1] && y < tc3[1]);
    }
}

App.GRAVITY = new Vector3(0, -9.81, 0);
App.TIME_STEP = 1 / 60;
App.GRAVITY_STEP = new Vector3().add(App.GRAVITY).scale(App.TIME_STEP);

App.SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};