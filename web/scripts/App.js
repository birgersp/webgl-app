include("util/FileLoader");
include("util/Controller");

include("geometry/Vector3");
include("geometry/Vertex");

include("Geometry");
include("geometry/Cube");

include("util/Initializable");
include("MasterRenderer");
include("User");
include("World");
include("TerrainMeshManager");

include("geometry/TerrainGridCell");

class App {

    constructor(gl) {

        this.engine = new MasterRenderer(gl);

        this.controller = new Controller();
        this.world = new World();
        this.terrainManager = new TerrainMeshManager(this.world, this.engine.terrainRenderer);

        this.grassTexture = null;
        this.rockTexture = null;

        this.user = new User();
        this.user.position = new Vector3(0, 55, 0);
        this.userOnGround = false;
//        this.controller.mode = Controller.moveMode.FREE;

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

        this.controller.addKeyDownEvent(Controller.keys.Q, function() {

            app.terrainManager.removeTerrainCoordinate(Math.random() * 64 - 32, Math.random() * 64 - 32);
        });
    }

    initialize(callback) {

        let fileLoader = new FileLoader();
        let crateImageFile = fileLoader.addImageFile("binaries/crate01.jpg");

        let app = this;
        fileLoader.load(function() {

            let crate = new Entity(new Cube(), crateImageFile.image);
            crate.transform.setTranslation(new Vector3(0, 55, -10));
            app.engine.entityRenderer.addEntity(crate);

            app.engine.initialize(function() {
                callback();
            });
        });
    }

    start(frameCallback) {

        frameCallback = frameCallback !== undefined ? frameCallback : function() {};

        this.terrainManager.initializeTerrainSection(-TerrainMeshManager.SECTION_SIZE / 2, TerrainMeshManager.SECTION_SIZE / 2);

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
        let terrainUserCollisionY = this.world.getBlockIntersectionYInterval(this.user.position, User.HEIGHT);
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

        this.engine.skyboxRenderer.yRotation += 0.0001;
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
    FSHADER: "shaders/fshader.webgl",
    SKYBOX_VSHADER: "shaders/skybox_vshader.webgl",
    SKYBOX_FSHADER: "shaders/skybox_fshader.webgl"
};
