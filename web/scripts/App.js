include("Identifyable");
include("User");
include("WebGLEngine");
include("Controller");
include("util/FileLoader");

class App {

    constructor(gl) {

        this.controller = new Controller();

        this.grassTexture = null;
        this.terrainCoordinates = {};
        this.user = new User();
        this.user.position = new Vector3(0, 4, 5);
        this.controller.rotation = new Vector3(0, 0, 0);
        this.engine = new WebGLEngine(gl);
        this.loader = new FileLoader();
        this.paused = true;
    }

    load(onloaded) {

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

            app.grassTexture = new WebGLEngine.Texture(grassImageFile.image);

            onloaded();
        });
    }

    start() {
        let app = this;
        function renderLoop() {
            app.stepTime();
            app.engine.render();
            setTimeout(renderLoop, App.TIME_STEP * 1000);
        }
        renderLoop();
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
                let vertex = new Vertex(c[0], c[1], c[2], i / 4, j / 4);
                vertices.set(vertex, vertexIndex++ * Vertex.LENGTH);

                let xIndex = Math.floor(c[0]);
                let zIndex = Math.floor(c[2]);
                if (!this.terrainCoordinates[xIndex])
                    this.terrainCoordinates[xIndex] = {};
                this.terrainCoordinates[xIndex][zIndex] = c;
            }

        let geometry = new WebGLEngine.Geometry(vertices, indices);
        let terrainObject = new WebGLEngine.Object(geometry, this.grassTexture);
        this.engine.addObject(terrainObject);
    }

    isBelowTerrain(coordinate) {

        let xIndex = Math.floor(coordinate[0]);
        if (this.terrainCoordinates[xIndex]) {
            let zIndex = Math.floor(coordinate[2]);
            let tc0 = this.terrainCoordinates[xIndex][zIndex];
            let tc1 = this.terrainCoordinates[xIndex + 1][zIndex];
            let tc2 = this.terrainCoordinates[xIndex][zIndex + 1];
            let tc3 = this.terrainCoordinates[xIndex + 1][zIndex + 1];
            let y = coordinate[1];
            if (tc0 && tc1 && tc2 && tc3)
                return (y < tc0[1] && y < tc1[1] && y < tc2[1] && y < tc3[1]);
        }
        return false;
    }

    stepTime() {

        this.controller.update();

        let controlVelocity = this.controller.velocity.getCopy();
        controlVelocity.scale(App.USER_SPEED);

        this.user.velocity[0] = controlVelocity[0];
        this.user.velocity[1] += App.GRAVITY_STEP;
        this.user.velocity[2] = controlVelocity[2];

        this.user.position.add(this.user.velocity.times(App.TIME_STEP));
        this.user.position[1] += this.user.velocity[1] * App.TIME_STEP + App.GRAVITY * (Math.pow(App.TIME_STEP, 2) / 2);

        var bottomCenter = this.user.position.plus(User.BOTTOM_CENTER_POS);
        var topCenter = this.user.position.plus(User.TOP_CENTER_POS);

        if (this.isBelowTerrain(bottomCenter) && !this.isBelowTerrain(topCenter)) {
            this.user.position[1] = -User.BOTTOM_CENTER_POS[1];
            this.user.velocity = this.controller.velocity.getCopy();
            this.user.velocity[1] = 0;

            if (this.controller.keysDown[" "])
                this.user.velocity[1] = 5;
        }

        var topCenter = this.user.position.plus(User.TOP_CENTER_POS);
        this.engine.camera.setTranslation(topCenter);
        this.engine.camera.setRotation(this.controller.rotation);
    }

    pause() {

        this.controller.disable();
        this.paused = true;
    }

    resume() {

        this.controller.enable();
        this.paused = false;
    }
}

App.GRAVITY = -9.81;
App.TIME_STEP = 1 / 60;
App.GRAVITY_STEP = App.GRAVITY * App.TIME_STEP;
App.USER_SPEED = 5;

App.SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};