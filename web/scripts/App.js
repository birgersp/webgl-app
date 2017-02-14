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
        this.user.position = new Vector3(0, 15, 0);
        this.userOnGround = false;
//        this.controller.rotation = new Vector3(-Math.PI / 2, 0, 0);
        this.controller.mode = Controller.moveMode.FREE;
        this.engine = new WebGLEngine(gl);
        this.paused = true;

        let app = this;
        this.controller.addKeyDownEvent(Controller.keys.ENTER, function() {

            if (app.controller.mode !== Controller.moveMode.FREE)
                app.controller.mode = Controller.moveMode.FREE;
            else if (app.controller.mode !== Controller.moveMode.XZ_PLANE)
                app.controller.mode = Controller.moveMode.XZ_PLANE;
        });

        this.controller.addKeyDownEvent(Controller.keys.SPACE, function() {

            if (app.userOnGround)
                app.user.velocity[1] = 5;
        });
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

            app.grassTexture = new WebGLEngine.Texture(grassImageFile.image);
            app.crateTexture = new WebGLEngine.Texture(crateImageFile.image);

            onloaded();
        });
    }

    start(frameCallback) {
        frameCallback = frameCallback !== undefined ? frameCallback : function() {};
        let app = this;
        function renderLoop() {
            app.stepTime();
            app.engine.render();
            setTimeout(renderLoop, App.MS_PER_FRAME);
            frameCallback();
        }
        renderLoop();
    }

    setTerrainMesh(coordinates) {

        let size = Math.sqrt(coordinates.length);

        let vertices = new Float32Array(coordinates.length * Vertex.LENGTH);
        let indices = new Uint16Array(Math.pow(size - 1, 2) * 6);

        let coordinateIndex = 0;
        let indexIndex = 0;
        for (let sectionJ = 0; sectionJ < size; sectionJ++)
            for (let sectionI = 0; sectionI < size; sectionI++) {

                let heightBottom = 0;
                let underNeighbourI;
                let underNeighbour;
                if (sectionJ > 0) {
                    underNeighbourI = coordinateIndex - size;
                    underNeighbour = coordinates[underNeighbourI];
                    heightBottom = underNeighbour[1];
                }

                let heightLeft = 0;
                if (sectionI > 0) {

                    let leftNeighbourI = coordinateIndex - 1;
                    let leftNeighbour = coordinates[leftNeighbourI];
                    heightLeft = leftNeighbour[1];

                    if (sectionJ > 0) {

                        // Compute indices
                        let bottomLeftNeighbourI = coordinateIndex - size - 1;
                        indices.set([bottomLeftNeighbourI, coordinateIndex, underNeighbourI, bottomLeftNeighbourI, leftNeighbourI, coordinateIndex], indexIndex++ * 6);

                        // Compute collidable terrain faces
                        let topright = coordinates[coordinateIndex];
                        let bottomleft = coordinates[bottomLeftNeighbourI];
                        let gridCell = new TerrainGridCell(leftNeighbour, topright, bottomleft, underNeighbour);
                        this.terrainManager.addGridCell(gridCell);
                    }
                }

                let heightRight = 0;
                if (sectionI < size - 1)
                    heightRight = coordinates[coordinateIndex + 1][1];
                let heightTop = 0;
                if (sectionJ < size - 1)
                    heightTop = coordinates[coordinateIndex + size][1];

                let c = coordinates[coordinateIndex];
                let n = new Vector3(heightLeft - heightRight, 2, heightBottom - heightTop).normalize();
                let vertex = new Vertex(c[0], c[1], c[2], n[0], n[1], n[2], sectionI / 4, sectionJ / 4);
                vertices.set(vertex, coordinateIndex++ * Vertex.LENGTH);
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
        this.userOnGround = false;

        // Check collision
        let terrainUserCollisionY = this.terrainManager.getTerrainIntersectionY(this.user.position, User.HEIGHT);
        if (terrainUserCollisionY !== null) {
            this.user.position[1] = terrainUserCollisionY;
            if (this.controller.mode !== Controller.moveMode.FREE) {
                this.user.velocity[1] = 0;
                this.userOnGround = true;
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
App.USER_SPEED = 7.5;
App.MS_PER_FRAME = App.TIME_STEP * 1000;

App.SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};
