
class Matrix4 extends Float32Array {
    
    static xyzRotation(x, y, z) {
    
        var c = Math.cos;
        var s = Math.sin;
        return new Matrix4([
            c(y) * c(z), c(z) * s(x) * s(y) - c(x) * s(z), s(x) * s(z) + c(x) * c(z) * s(y), 0,
            c(y) * s(z), c(x) * c(z) + s(x) * s(y) * s(z), c(x) * s(y) * s(z) - c(z) * s(x), 0,
            -s(y), c(y) * s(x), c(x) * c(y), 0,
            0, 0, 0, 1
        ]);
    }

    static identity() {
        
        return new Matrix4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    }
    
    constructor(array) {
        
        if (array)
            super(array);
        else
            super(16);
    }
}
