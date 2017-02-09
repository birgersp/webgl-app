class ViewController {

    constructor(camera) {

        this.enabled = false;
        this.speed = 0.1;
        this.camera = camera;
        this.keysDown = {};
        this.maxMouseMoveCoordinate = 50;

        var viewController = this;
        document.addEventListener("mousemove", function(evt) {
            viewController.mouseMoved(evt);
        }, false);
        document.addEventListener("keydown", function(evt) {
            if (viewController.enabled)
                viewController.keysDown[evt.key.toLowerCase()] = true;
        }, false);
        document.addEventListener("keyup", function(evt) {
            viewController.keysDown[evt.key.toLowerCase()] = false;
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

            var speed = this.speed;
            if (this.keysDown.shift) {
                speed *= 0.5;
            }

            if (this.keysDown.w) {
                var headingPitch = this.camera.r[0];
                var headingYaw = this.camera.r[1];
                var vector = new Vector3(
                        -Math.sin(headingYaw) * Math.cos(headingPitch),
                        Math.sin(headingPitch),
                        -Math.cos(headingYaw) * Math.cos(headingPitch));
                vector.scale(speed);
                vector.add(this.camera.t);
                this.camera.setTranslation(vector);
            } else
            if (this.keysDown.s) {
                var headingPitch = this.camera.r[0];
                var headingYaw = this.camera.r[1];
                var vector = new Vector3(
                        -Math.sin(headingYaw) * Math.cos(headingPitch),
                        Math.sin(headingPitch),
                        -Math.cos(headingYaw) * Math.cos(headingPitch));
                vector.scale(-speed);
                vector.add(this.camera.t);
                this.camera.setTranslation(vector);
            }

            if (this.keysDown.a) {
                var headingYaw = this.camera.r[1] + Math.PI / 2;
                var vector = new Vector3(
                        -Math.sin(headingYaw),
                        0,
                        -Math.cos(headingYaw));
                vector.scale(speed);
                vector.add(this.camera.t);
                this.camera.setTranslation(vector);
            } else
            if (this.keysDown.d) {
                var headingYaw = this.camera.r[1] - Math.PI / 2;
                var vector = new Vector3(
                        -Math.sin(headingYaw),
                        0,
                        -Math.cos(headingYaw));
                vector.scale(speed);
                vector.add(this.camera.t);
                this.camera.setTranslation(vector);
            }
        }
    }

    mouseMoved(event) {
        if (this.enabled) {
            var x = event.movementX;
            if (x > this.maxMouseMoveCoordinate)
                x = this.maxMouseMoveCoordinate;
            else if (x < -this.maxMouseMoveCoordinate)
                x = -this.maxMouseMoveCoordinate;

            var y = event.movementY;
            if (y > this.maxMouseMoveCoordinate)
                y = this.maxMouseMoveCoordinate;
            else if (y < -this.maxMouseMoveCoordinate)
                y = -this.maxMouseMoveCoordinate;

            this.camera.r[0] -= y / 1000;
            this.camera.r[1] -= x / 1000;

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

            this.camera.updated = false;
        }
    }
}