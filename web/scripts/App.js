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
        this.rockTexture = null;

        this.user = new User();
        this.user.position = new Vector3(0, 55, 0);
        this.userOnGround = false;
        this.controller.rotation = new Vector3(0, Math.PI / 4, 0);
//        this.controller.mode = Controller.moveMode.FREE;
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
                app.user.velocity[1] = App.JUMP_SPEED;
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
        var rockImageFile = loader.addImageFile("binaries/rock.jpg");

        let engine = this.engine;
        let app = this;
        loader.load(function() {
            engine.initialize(
                    shaderFiles[App.SHADER_FILENAMES.VSHADER].text,
                    shaderFiles[App.SHADER_FILENAMES.FSHADER].text
                    );

            engine.gl.clearColor(0.7, 0.85, 1, 1);


            engine.uniformManager.sunDirection.write(new Vector3(-1, -1, -1));
            engine.uniformManager.sunColor.write(new Vector3(1, 1, 1));

            engine.uniformManager.viewDistance.write(engine.camera.f);
            engine.uniformManager.fogFactor.write(3);

            app.grassTexture = new WebGLEngine.Texture(grassImageFile.image);
            app.crateTexture = new WebGLEngine.Texture(crateImageFile.image);
            app.rockTexture = new WebGLEngine.Texture(rockImageFile.image);

            engine.setTerrainTextures(app.grassTexture, app.rockTexture);

            onloaded();
        });
    }

    setTerrainMesh(coordinates) {

        let size = Math.sqrt(coordinates.length);
        let sectionSize = 9; // Coordinates^2 per section
        let sections = Math.ceil(size / sectionSize);
        let uvScale = 1 / (sectionSize - 1);

        let sectionI, sectionJ;
        function getSectionCoordinateIndex(i, j) {
            let index = sectionJ * size * (sectionSize - 1) + sectionI * (sectionSize - 1) + j * size + i;
            return index;
        }

        function getSectionCoordinate(i, j) {

            let index = getSectionCoordinateIndex(i, j);
            if (index >= 0 && index < coordinates.length)
                return coordinates[index];
            else
                return null;
        }

        for (sectionJ = 0; sectionJ < sections; sectionJ++) {
            for (sectionI = 0; sectionI < sections; sectionI++) {

                let vertexIndex = 0;
                let indexIndex = 0;
                let vertices = new Float32Array(Math.pow(sectionSize, 2) * Vertex.LENGTH);
                let indices = new Uint16Array(Math.pow(sectionSize - 1, 2) * 6);

                for (let j = 0; j < sectionSize; j++) {
                    for (let i = 0; i < sectionSize; i++) {

                        let coord = getSectionCoordinate(i, j);

                        let left = getSectionCoordinate(i - 1, j);
                        let heightLeft = left ? left[1] : coord[1];

                        let right = getSectionCoordinate(i + 1, j);
                        let heightRight = right ? right[1] : coord[1];

                        let top = getSectionCoordinate(i, j + 1);
                        let heightTop = top ? top[1] : coord[1];

                        let bottom = getSectionCoordinate(i, j - 1);
                        let heightBottom = bottom ? bottom[1] : coord[1];

                        if (i > 0 && j > 0) {
                            let bottomleft = getSectionCoordinate(i - 1, j - 1);
                            this.terrainManager.addGridCell(new TerrainGridCell(left, coord, bottomleft, bottom));

                            let b = j * sectionSize + i;
                            let a = b - 1;
                            let d = b - sectionSize;
                            let c = d - 1;

                            indices.set([a, c, b, b, c, d], indexIndex++ * 6);
                        }

                        let n = new Vector3(heightLeft - heightRight, 2, heightBottom - heightTop).normalize();
                        vertices.set(new Vertex(coord[0], coord[1], coord[2], n[0], n[1], n[2], i * uvScale, j * uvScale), vertexIndex++ * Vertex.LENGTH);
                    }
                }
                let geometry = new WebGLEngine.Geometry(vertices, indices);
                let terrainObject = new WebGLEngine.TerrainObject(geometry, this.rockTexture, this.grassTexture);
                this.engine.addTerrainObject(terrainObject);
            }
        }
    }

    start(frameCallback) {

        frameCallback = frameCallback !== undefined ? frameCallback : function() {};

        let app = this;
        app.engine.render();
        function render() {
            app.stepTime();
            app.engine.render();
            setTimeout(loop, App.MS_PER_FRAME);
            frameCallback();
        }

        function loop() {
            requestAnimationFrame(render);
        }
        loop();
    }

    stepTime() {

        // Check control input
        this.controller.update();
        this.user.velocity[0] = this.controller.velocity[0] * App.USER_SPEED;
        this.user.velocity[2] = this.controller.velocity[2] * App.USER_SPEED;
        if (this.controller.mode === Controller.moveMode.FREE)
            this.user.velocity[1] = this.controller.velocity[1] * App.USER_SPEED;
        else
            this.user.velocity[1] += App.GRAVITY_STEP_VEL_Y;

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
                if (this.user.velocity[1] < 0)
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
App.MS_PER_FRAME = 1000 / 60;
App.TIME_STEP = App.MS_PER_FRAME / 1000 * 2; // 1/30 sec
App.GRAVITY_STEP_POS_Y = App.GRAVITY_Y * Math.pow(App.TIME_STEP, 2) / 2;
App.GRAVITY_STEP_VEL_Y = App.GRAVITY_Y * App.TIME_STEP;
App.USER_SPEED = 4; // m / s
App.JUMP_SPEED = 7;

App.SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};
