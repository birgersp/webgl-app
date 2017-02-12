class Controller {

    constructor() {

        this.enabled = false;
        this.keysDown = {};
        this.maxMouseMoveCoordinate = 50;
        this.velocity = new Vector3();
        this.rotation = new Vector3();
        this.mode = Controller.XZ_PLANE;
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

            this.velocity = new Vector3();
            if (this.keysDown.w) {
                var headingPitch = this.rotation[0];
                var headingYaw = this.rotation[1];
                var vector = new Vector3(
                        -Math.sin(headingYaw) * Math.cos(headingPitch),
                        0,
                        -Math.cos(headingYaw) * Math.cos(headingPitch));
                if (this.mode === Controller.moveMode.FREE)
                    vector[1] = Math.sin(headingPitch);
                this.velocity.add(vector);
            } else
            if (this.keysDown.s) {
                var headingPitch = this.rotation[0];
                var headingYaw = this.rotation[1];
                var vector = new Vector3(
                        -Math.sin(headingYaw) * Math.cos(headingPitch),
                        0,
                        -Math.cos(headingYaw) * Math.cos(headingPitch));
                if (this.mode === Controller.moveMode.FREE)
                    vector[1] = Math.sin(headingPitch);
                vector.scale(-1);
                this.velocity.add(vector);
            }

            if (this.keysDown.a) {
                var headingYaw = this.rotation[1] + Math.PI / 2;
                var vector = new Vector3(
                        -Math.sin(headingYaw),
                        0,
                        -Math.cos(headingYaw));
                this.velocity.add(vector);
            } else
            if (this.keysDown.d) {
                var headingYaw = this.rotation[1] - Math.PI / 2;
                var vector = new Vector3(
                        -Math.sin(headingYaw),
                        0,
                        -Math.cos(headingYaw));
                this.velocity.add(vector);
            }

            this.velocity.normalize();
            if (this.keysDown.shift)
                this.velocity.scale(0.5);
        }
    }

    keyDown(key) {

        this.keysDown[key] = true;
    }

    keyUp(key) {

        this.keysDown[key] = false;
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
            if (this.rotation[0] < Controller.MIN_X_ROTATION) {
                this.rotation[0] = Controller.MIN_X_ROTATION;
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

Controller.MIN_X_ROTATION = -Math.PI / 2 + 1 / 1000000;
Controller.moveMode = {
    XZ_PLANE: 0,
    FREE: 1
};
