class Controller {

    constructor() {

        this.enabled = false;
        this.speed = 0.1;
        this.keysDown = {};
        this.maxMouseMoveCoordinate = 50;
        this.velocity = new Vector3();
        this.rotation = new Vector3();

        var viewController = this;
        document.addEventListener("mousemove", function(evt) {
            viewController.mouseMoved(evt.movementX, evt.movementY);

        }, false);
        document.addEventListener("keydown", function(evt) {
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

            this.velocity = new Vector3();
            if (this.keysDown.w) {
                var headingPitch = this.rotation[0];
                var headingYaw = this.rotation[1];
                var vector = new Vector3(
                        -Math.sin(headingYaw) * Math.cos(headingPitch),
                        Math.sin(headingPitch),
                        -Math.cos(headingYaw) * Math.cos(headingPitch));
                vector.scale(speed);
                this.velocity.add(vector);
            } else
            if (this.keysDown.s) {
                var headingPitch = this.rotation[0];
                var headingYaw = this.rotation[1];
                var vector = new Vector3(
                        -Math.sin(headingYaw) * Math.cos(headingPitch),
                        Math.sin(headingPitch),
                        -Math.cos(headingYaw) * Math.cos(headingPitch));
                vector.scale(-speed);
                this.velocity.add(vector);
            }

            if (this.keysDown.a) {
                var headingYaw = this.rotation[1] + Math.PI / 2;
                var vector = new Vector3(
                        -Math.sin(headingYaw),
                        0,
                        -Math.cos(headingYaw));
                vector.scale(speed);
                this.velocity.add(vector);
            } else
            if (this.keysDown.d) {
                var headingYaw = this.rotation[1] - Math.PI / 2;
                var vector = new Vector3(
                        -Math.sin(headingYaw),
                        0,
                        -Math.cos(headingYaw));
                vector.scale(speed);
                this.velocity.add(vector);
            }
        }
    }

    mouseMoved(x, y) {
        if (this.enabled) {
            if (x > this.maxMouseMoveCoordinate)
                x = this.maxMouseMoveCoordinate;
            else if (x < -this.maxMouseMoveCoordinate)
                x = -this.maxMouseMoveCoordinate;

            if (y > this.maxMouseMoveCoordinate)
                y = this.maxMouseMoveCoordinate;
            else if (y < -this.maxMouseMoveCoordinate)
                y = -this.maxMouseMoveCoordinate;

            this.rotation[0] -= y / 1000;
            this.rotation[1] -= x / 1000;

            if (this.rotation[0] > Math.PI / 2) {
                this.rotation[0] = Math.PI / 2;
            } else
            if (this.rotation[0] < -Math.PI / 2) {
                this.rotation[0] = -Math.PI / 2;
            }

            if (this.rotation[1] > Math.PI) {
                this.rotation[1] -= Math.PI * 2;
            } else
            if (this.rotation[1] < -Math.PI) {
                this.rotation[1] += Math.PI * 2;
            }
        }
    }
}