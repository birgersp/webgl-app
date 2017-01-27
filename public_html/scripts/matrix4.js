
// This function should override the Float32Array constructor
var Matrix4 = function() {
    Float32Array.call(this, 16);
};

Matrix4.prototype = new Float32Array;

Matrix4.prototype.sayHello = function() {
    console.log("!");
};

//var matrix = {
//    xyzRotation(x, y, z) {
//        return [
//            cos(y) * cos(z), cos(z) * sin(x) * sin(y) - cos(x) * sin(z), sin(x) * sin(z) + cos(x) * cos(z) * sin(y), 1,
//            cos(y) * sin(z), cos(x) * cos(z) + sin(x) * sin(y) * sin(z), cos(x) * sin(y) * sin(z) - cos(z) * sin(x), 0,
//            -sin(y), cos(y) * sin(x), cos(x) * cos(y), 0,
//            0, 0, 0, 1
//        ];
//    }
//};