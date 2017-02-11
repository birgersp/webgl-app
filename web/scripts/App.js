include("Identifyable");
include("User");
include("WebGLEngine");
include("Controller");

class App {

    constructor(engine) {

        this.controller = new Controller();
        this.surface = [];
        this.surfaceFaces = [[]];
        
        this.user = new User();
        this.user.position = new Vector3(13,6,15);
        this.controller.rotation = new Vector3(-0.2,0.5,0);
        this.engine = engine;
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
}

App.GRAVITY = new Vector3(0, -9.81, 0);
App.TIME_STEP = 1 / 60;
        