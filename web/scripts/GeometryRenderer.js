class GeometryRenderer extends Renderer {

    constructor(gl) {

        super(gl);
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
}
