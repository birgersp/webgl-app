class ShaderUniformManager {

    constructor(gl) {

        this.gl = gl;
        this.shaderProgram = null;

        this.view = null;
        this.projection = null;
        this.transform = null;

        this.sampler = null;

        this.sunDirection = null;
        this.sunColor = null;

        this.viewDistance = null;
        this.fogFactor = null;
    }

    initialize(shaderProgram) {

        this.shaderProgram = shaderProgram;
        this.view = this.locateMatrix("view");
        this.transform = this.locateMatrix("transform");
        this.projection = this.locateMatrix("projection");

        this.sampler = this.locateInteger("sampler");

        this.sunDirection = this.locateVector3("sunDirection");
        this.sunColor = this.locateVector3("sunColor");

        this.viewDistance = this.locateFloat("viewDistance");
        this.fogFactor = this.locateFloat("fogFactor");
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
