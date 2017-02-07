class ViewController {

    constructor(camera) {

        this.enabled = false;
        this.speed = 0.1;
        this.camera = camera;
        this.keysDown = {};

        var viewController = this;
        document.addEventListener("mousemove", function (evt) {
            viewController.mouseMoved(evt);
        }, false);
        document.addEventListener("keydown", function (evt) {
            if (viewController.enabled)
                viewController.keysDown[event.key] = true;
        }, false);
        document.addEventListener("keyup", function (evt) {
            viewController.keysDown[event.key] = false;
        }, false);
    }

    enable() {

        this.enabled = true;
    }

    disable() {

        this.enabled = false;
        this.keysDown = {};
    }

    update() {

        if (this.enabled) {
            if (this.keysDown.a) {
                this.camera.t[0] -= this.speed * Math.cos(this.camera.r[1]);
                this.camera.t[2] += this.speed * Math.sin(this.camera.r[1]);
                this.camera.updated = false;
            } else
            if (this.keysDown.d) {
                this.camera.t[0] += this.speed * Math.cos(this.camera.r[1]);
                this.camera.t[2] -= this.speed * Math.sin(this.camera.r[1]);
                this.camera.updated = false;
            }

            if (this.keysDown.w) {
                this.camera.t[2] -= this.speed * Math.cos(this.camera.r[1]);
                this.camera.t[1] += this.speed * Math.sin(this.camera.r[0]);
                this.camera.t[0] -= this.speed * Math.sin(this.camera.r[1]);
                this.camera.updated = false;
            } else
            if (this.keysDown.s) {
                this.camera.t[2] += this.speed * Math.cos(this.camera.r[1]);
                this.camera.t[1] -= this.speed * Math.sin(this.camera.r[0]);
                this.camera.t[0] += this.speed * Math.sin(this.camera.r[1]);
                this.camera.updated = false;
            }
        }
    }

    mouseMoved(event) {
        if (this.enabled) {
            this.camera.r[0] -= event.movementY / 2000;
            if (this.camera.r[0] > Math.PI / 2) {
                this.camera.r[0] = Math.PI / 2;
            } else
            if (this.camera.r[0] < -Math.PI / 2) {
                this.camera.r[0] = -Math.PI / 2;
            }

            if (this.camera.r[1] > Math.PI) {
                this.camera.r[1] -= Math.PI * 2;
            } else
            if (this.camera.r[1] < -Math.PI) {
                this.camera.r[1] += Math.PI * 2;
            }

            this.camera.r[1] -= event.movementX / 2000;
            this.camera.updated = false;
        }
    }
}