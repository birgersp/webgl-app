class NormalVectorBuilder {

    static rotateVector90DegX(vector, sign) {
        sign = sign !== undefined ? sign : 1;
        vector.set([vector[0], -vector[2] * sign, -vector[1] * sign]);
        return vector;
    }

    static rotateVector90DegZ(vector, sign) {

        sign = sign !== undefined ? sign : 1;
        vector.set([-vector[1] * sign, vector[0] * sign, vector[2]]);
        return vector;
    }

    constructor(origin) {

        this.neighbours = 0;
        this.neighboursSummed = new Vector3();
        this.origin = origin;
    }

    addRightNeighbour(coordinate) {

        let rightNormal = NormalVectorBuilder.rotateVector90DegZ(coordinate.minus(this.origin).normalize());
        this.neighboursSummed.add(rightNormal);
        this.neighbours++;
    }

    addLeftNeighbour(coordinate) {

        let leftNormal = NormalVectorBuilder.rotateVector90DegZ(coordinate.minus(this.origin).normalize(), -1);
        this.neighboursSummed.add(leftNormal);
        this.neighbours++;
    }

    addTopNeighbour(coordinate) {

        let topNormal = NormalVectorBuilder.rotateVector90DegX(coordinate.minus(this.origin).normalize());
        this.neighboursSummed.add(topNormal);
        this.neighbours++;
    }

    addBottomNeighbour(coordinate) {

        let bottomNormal = NormalVectorBuilder.rotateVector90DegX(coordinate.minus(this.origin).normalize(), -1);
        this.neighboursSummed.add(bottomNormal);
        this.neighbours++;
    }

    getNormalVector() {

        return this.neighboursSummed.times(1 / this.neighbours);
    }
}
