class ViewController {

    constructor(camera) {

        this.enabled = false;
        this.speed = 1;
        this.keysDown = [];
        this.prevMouseX_ = 0;
        this.prevMouseY_ = 0;
        this.camera = camera;

        var viewController = this;
        document.addEventListener("mousemove", function (evt) {
            viewController.mouseMoved(evt);
        }, false);
    }

    enable() {

        this.enabled = true;
    }

    disable() {

        this.enabled = false;
    }

    update() {

        if (this.enabled) {


        }
    }

    mouseMoved(event) {
        if (this.enabled) {
            this.camera.r[0] -= event.movementY / 1000;
            if (this.camera.r[0] > Math.PI / 2) {
                this.camera.r[0] = Math.PI / 2;
            } else
            if (this.camera.r[0] < -Math.PI / 2) {
                this.camera.r[0] = -Math.PI / 2;
            }
            this.camera.r[1] -= event.movementX / 1000;
            this.camera.updated = false;
        }
    }

    keyDown(event) {


    }

    keyUp(event) {

        if (this.enabled) {


        }
    }
}