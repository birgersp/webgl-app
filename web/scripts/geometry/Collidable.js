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
        this.topleftNormal = getNormalVector(topleft, bottomleft, topright);
        this.bottomrightNormal = getNormalVector(bottomright, topright, bottomleft);
    }

    getCollisionPoint(origin, vector) {

        let vectorLength = vector.getMagnitude();
        let d = new Vector3(vector[0] / vectorLength, vector[1] / vectorLength, vector[2] / vectorLength);
        let t = getVectorPlaneIntersection(origin, d, this.topleft, this.topleftNormal);
        if (t < 0 && t > vectorLength)
            return null;
        else
            return d.scale(t).add(origin);
    }
};
