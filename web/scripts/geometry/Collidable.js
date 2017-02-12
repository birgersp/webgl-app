include("../util/math");

class Collidable {

    getCollisionPoint(origin, vector) {
        throw new Error("Cannot invoke abstract function");
    }
}

CollidableFace = class extends Collidable {

    constructor(topleft, topright, bottomleft, bottomright) {

        super();
        this.topleft = topleft;
        this.topright = topright;
        this.bottomleft = bottomleft;
        this.bottomright = bottomright;
    }

    getCollisionPoint(origin, vector) {

        let vectorLength = vector.getMagnitude();
        let d = new Vector3(vector[0] / vectorLength, vector[1] / vectorLength, vector[2] / vectorLength);

        let t = null;
        let t1 = getRayTriangleIntersection(this.topleft, this.bottomleft, this.topright, origin, d);
        let t2 = getRayTriangleIntersection(this.bottomright, this.topright, this.bottomleft, origin, d);

        if (t1 !== null && t1 <= vectorLength) {
            t = t1;
        }

        if (t2 !== null && t2 <= vectorLength) {
            if (t === null || t2 < t)
                t = t2;
        }

        if (t !== null) {
            d.scale(t).add(origin);
            return d;
        }
    }
};
