class ShaderUniformManager {

    constructor(gl, shaderProgram) {

        this.gl = gl;
        this.shaderProgram = shaderProgram;
    }

    getUniformL(name) {

        return this.gl.getUniformLocation(this.shaderProgram, name);
    }

    locateMatrix(name) {

        return new ShaderUniform.Matrix(this.gl, this.getUniformL(name));
    }

    locateVector3(name) {

        return new ShaderUniform.Vector3(this.gl, this.getUniformL(name));
    }

    locateInteger(name) {

        return new ShaderUniform.Integer(this.gl, this.getUniformL(name));
    }

    locateFloat(name) {

        return new ShaderUniform.Float(this.gl, this.getUniformL(name));
    }
}

class ShaderUniform {

    constructor(gl, location) {

        this.gl = gl;
        this.location = location;
    }
}

ShaderUniform.Matrix = class extends ShaderUniform {

    constructor(gl, location) {

        super(gl, location);
    }

    write(value) {

        this.gl.uniformMatrix4fv(this.location, false, value);
    }
};

ShaderUniform.Vector3 = class extends ShaderUniform {

    constructor(gl, location) {

        super(gl, location);
    }

    write(value) {

        this.gl.uniform3fv(this.location, value);
    }
};

ShaderUniform.Integer = class extends ShaderUniform {

    constructor(gl, location) {

        super(gl, location);
    }

    write(value) {

        this.gl.uniform1i(this.location, value);
    }
};

ShaderUniform.Float = class extends ShaderUniform {

    constructor(gl, location) {

        super(gl, location);
    }

    write(value) {

        this.gl.uniform1f(this.location, value);
    }
};
