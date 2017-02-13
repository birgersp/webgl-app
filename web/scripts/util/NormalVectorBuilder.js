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

        this.neighboursSummed.add(NormalVectorBuilder.rotateVector90DegZ(coordinate.minus(this.origin).normalize()));
        this.neighbours++;
    }

    addLeftNeighbour(coordinate) {

        this.neighboursSummed.add(NormalVectorBuilder.rotateVector90DegZ(coordinate.minus(this.origin).normalize(), -1));
        this.neighbours++;
    }

    addTopNeighbour(coordinate) {

        this.neighboursSummed.add(NormalVectorBuilder.rotateVector90DegX(coordinate.minus(this.origin).normalize()));
        this.neighbours++;
    }

    addBottomNeighbour(coordinate) {

        this.neighboursSummed.add(NormalVectorBuilder.rotateVector90DegX(coordinate.minus(this.origin).normalize(), -1));
        this.neighbours++;
    }

    getNormalVector() {

        return this.neighboursSummed.times(1 / this.neighbours);
    }
}
