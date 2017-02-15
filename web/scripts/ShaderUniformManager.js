class ShaderUniformManager {

    constructor(gl) {

        this.gl = gl;

        this.viewL = null;
        this.projectionL = null;
        this.transformL = null;

        this.samplerL = null;
        this.useColorL = null;
    }

    initialize(shaderProgram) {

        this.viewL = this.gl.getUniformLocation(shaderProgram, "view");
        this.transformL = this.gl.getUniformLocation(shaderProgram, "transform");
        this.projectionL = this.gl.getUniformLocation(shaderProgram, "projection");

        this.samplerL = this.gl.getUniformLocation(shaderProgram, "sampler");
        this.useColorL = this.gl.getUniformLocation(shaderProgram, "useColor");
    }

    writeMatrix(location, matrix) {

        this.gl.uniformMatrix4fv(location, false, matrix);
    }

    writeInteger(location, value) {

        this.gl.uniform1i(location, value);
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
}
