class ShaderUniformManager {

    constructor(gl) {

        this.gl = gl;
        this.shaderProgram = null;

        this.viewL = null;
        this.projectionL = null;
        this.transformL = null;

        this.samplerL = null;
        this.useColorL = null;

        this.sunDirectionL = null;
        this.sunColorL = null;
    }

    initialize(shaderProgram) {

        this.shaderProgram = shaderProgram;
        this.viewL = this.getUniformL("view");
        this.transformL = this.getUniformL("transform");
        this.projectionL = this.getUniformL("projection");

        this.samplerL = this.getUniformL("sampler");
        this.useColorL = this.getUniformL("useColor");

        this.sunDirectionL = this.getUniformL("sunDirection");
        this.sunColorL = this.getUniformL("sunColor");
    }

    getUniformL(name) {

        return this.gl.getUniformLocation(this.shaderProgram, name);
    }

    writeMatrix(location, matrix) {

        this.gl.uniformMatrix4fv(location, false, matrix);
    }

    writeInteger(location, value) {

        this.gl.uniform1i(location, value);
    }

    writeVector(location, value) {

        this.gl.uniform3fv(location, value);
    }

    setView(matrix) {

        this.writeMatrix(this.viewL, matrix);
    }

    setProjection(matrix) {

        this.writeMatrix(this.projectionL, matrix);
    }

    setTransform(matrix) {

        this.writeMatrix(this.transformL, matrix);
    }

    setSampler(value) {

        this.writeInteger(this.samplerL, value);
    }

    setSunDirection(vector) {

        this.writeVector(this.sunDirectionL, vector);
    }

    setSunColor(vector) {

        this.writeVector(this.sunColorL, vector);
    }
}
