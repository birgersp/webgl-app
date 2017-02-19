include("Geometry");

class GeometryRenderer extends Renderer {

    constructor(gl) {

        super(gl);

        this.geometries = [];

        this.viewUniform = null;
        this.projectionUniform = null;
        this.samplerUniform = null;
        this.sunDirectionUniform = null;
        this.sunColorUniform = null;
        this.viewDistanceUniform = null;
        this.fogFactorUniform = null;
        this.fogColorUniform = null;

        this.positionAL = null;
        this.normalAL = null;
        this.textureCoordAL = null;
    }

    initializeUniforms() {

        let uniformManager = this.getUniformManager();
        this.viewUniform = uniformManager.locateMatrix("view");
        this.projectionUniform = uniformManager.locateMatrix("projection");
        this.samplerUniform = uniformManager.locateInteger("sampler");

        this.sunDirectionUniform = uniformManager.locateVector3("sunDirection");
        this.sunColorUniform = uniformManager.locateVector3("sunColor");
        this.viewDistanceUniform = uniformManager.locateFloat("viewDistance");
        this.fogFactorUniform = uniformManager.locateFloat("fogFactor");
        this.fogColorUniform = uniformManager.locateVector3("fogColor");

        this.positionAL = this.getAttributeLocation("position");
        this.normalAL = this.getAttributeLocation("normal");
        this.textureCoordAL = this.getAttributeLocation("textureCoord");
    }

    addGeometry(geometry) {

        if (!this.hasArrayBuffered(geometry.vertices))
            this.bufferArrayF(geometry.vertices);

        if (!this.hasArrayBuffered(geometry.indices))
            this.bufferElementArrayI(geometry.indices);

        this.geometries.push(geometry);
    }

    renderGeometry(geometry) {

        this.bindArrayBuffer(geometry.vertices);
        this.enableAttributeF(this.positionAL, 0, 3, 8);
        this.enableAttributeF(this.normalAL, 3, 3, 8, true);
        this.enableAttributeF(this.textureCoordAL, 6, 2, 8);
        this.bindElementArrayBuffer(geometry.indices);
        this.gl.drawElements(this.gl.TRIANGLES, geometry.indices.length, this.gl.UNSIGNED_BYTE, 0);
    }
}
