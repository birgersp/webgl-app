include("Identifyable");
include("User");
include("WebGLEngine");
include("Controller");
include("util/FileLoader");

class App {

    constructor(gl) {

        this.controller = new Controller();

        this.user = new User();
        this.user.position = new Vector3(13, 6, 15);
        this.controller.rotation = new Vector3(-0.2, 0.5, 0);
        this.engine = new WebGLEngine(gl);
        this.loader = new FileLoader();
    }

    stepTime() {

        this.controller.update();
        this.user.position.add(this.controller.velocity);

//        player.velocity.add(Game.GRAVITY);
//        player.position.add(player.velocity);
//        var bottomCenter = player.position.plus(Player.BOTTOM_CENTER_POS);

//        var xIndex = Math.floor(bottomCenter[0]);
//        var zIndex = Math.floor(bottomCenter[2]);

//        var a = this.surface.slice(this.surfaceFaces[xIndex], this.surfaceFaces[xIndex] + 1);
//        let a = 

        var topCenter = this.user.position.plus(User.BOTTOM_CENTER_POS);
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
            var surface1 = new WebGLEngine.Object(GeometryBuilder.getSurfaceGeometry(8), grassTexture);
            surface1.transform.setScale(new Vector3(16, 16, 1));
            surface1.transform.setRotation(new Vector3(-Math.PI / 2, 0, 0));
            surface1.transform.setTranslation(new Vector3(-8, 0, 8));
            engine.addObject(surface1);

            function renderLoop() {
                app.stepTime();
                engine.render();
                setTimeout(renderLoop, 1000 / 60);
            }
            renderLoop();
        });
    }
}

App.GRAVITY = new Vector3(0, -9.81, 0);
App.TIME_STEP = 1 / 60;

App.SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};