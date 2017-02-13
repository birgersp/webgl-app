include("Identifyable");
include("User");
include("WebGLEngine");
include("Controller");
include("util/FileLoader");
include("TerrainManager");
include("geometry/TerrainGridCell");

class App {

    constructor(gl) {

        this.controller = new Controller();
        this.terrainManager = new TerrainManager();

        this.grassTexture = null;
        this.user = new User();
        this.user.position = new Vector3(0, 11, 0);
        this.controller.rotation = new Vector3(0, 0, 0);
//        this.controller.mode = Controller.moveMode.FREE;
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
//        var crateImageFile = loader.addImageFile("binaries/crate.jpg");
        var grassImageFile = loader.addImageFile("binaries/grass.jpg");

        let engine = this.engine;
        let app = this;
        loader.load(function() {
            engine.initialize(
                    shaderFiles[App.SHADER_FILENAMES.VSHADER].text,
                    shaderFiles[App.SHADER_FILENAMES.FSHADER].text
                    );

//            var cube = new Cube();
//            var crateTexture = new WebGLEngine.Texture(crateImageFile.image);
//            var object1 = new WebGLEngine.Object(cube, crateTexture);
//            object1.transform.setTranslation(new Vector3(0, 0.5, 0));
//            engine.addObject(object1);

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

                    // Compute indices
                    let a = vertexIndex - size - 1;
                    let b = a + 1;
                    let c = vertexIndex - 1;
                    indices.set([a, vertexIndex, b, a, c, vertexIndex], indexIndex++ * 6);

                    // Compute collidable terrain faces
                    let topleft = coordinates[c];
                    let topright = coordinates[vertexIndex];
                    let bottomleft = coordinates[a];
                    let bottomright = coordinates[b];
                    let gridCell = new TerrainGridCell(topleft, topright, bottomleft, bottomright);
                    this.terrainManager.addGridCell(gridCell);
                }

                let c = coordinates[vertexIndex];
                let vertex = new Vertex(c[0], c[1], c[2], i / 4, j / 4);
                vertices.set(vertex, vertexIndex++ * Vertex.LENGTH);
            }

        let geometry = new WebGLEngine.Geometry(vertices, indices);
        let terrainObject = new WebGLEngine.Object(geometry, this.grassTexture);
        this.engine.addObject(terrainObject);
    }

    stepTime() {

        // Check control input
        this.controller.update();
        let controlVelocity = this.controller.velocity.getCopy();
        controlVelocity.scale(App.USER_SPEED);
        this.user.velocity[0] = controlVelocity[0];
        if (this.controller.mode === Controller.moveMode.FREE)
            this.user.velocity[1] = controlVelocity[1];
        else
            this.user.velocity[1] += App.GRAVITY_STEP_VEL_Y;
        this.user.velocity[2] = controlVelocity[2];

        // Set new position
        let dPosition = this.user.velocity.times(App.TIME_STEP);
        if (this.controller.mode !== Controller.moveMode.FREE)
            dPosition[1] += App.GRAVITY_STEP_POS_Y;
        this.user.position.add(dPosition);

        // Check collision
        let terrainUserCollisionY = this.terrainManager.getTerrainIntersectionY(this.user.position, User.HEIGHT);
        if (terrainUserCollisionY !== null) {
            this.user.position[1] = terrainUserCollisionY;
            if (this.controller.mode !== Controller.moveMode.FREE) {
                this.user.velocity[1] = 0;
                if (this.controller.keysDown[Controller.keys.SPACE])
                    this.user.velocity[1] = 10;
            }
        }

        let newTopCenter = this.user.position.getCopy();
        newTopCenter[1] += User.HEIGHT;
        this.engine.camera.setTranslation(newTopCenter);
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

App.GRAVITY_Y = -9.81;
App.TIME_STEP = 1 / 60;
App.GRAVITY_STEP_POS_Y = App.GRAVITY_Y * Math.pow(App.TIME_STEP, 2) / 2;
App.GRAVITY_STEP_VEL_Y = App.GRAVITY_Y * App.TIME_STEP;
App.USER_SPEED = 5;

App.SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};
