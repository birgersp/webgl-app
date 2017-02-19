include("Camera");

include("util/InitializableManager");
include("Renderer");
include("GeometryRenderer");
include("TerrainRenderer");
include("SkyboxRenderer");
include("EntityRenderer");

class MasterRenderer extends Initializable {

    constructor(gl) {

        super();
        this.gl = gl;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);

        this.camera = new Camera();
        this.skyboxRenderer = new SkyboxRenderer(this.gl, 64);
        this.terrainRenderer = new TerrainRenderer(this.gl);
        this.entityRenderer = new EntityRenderer(this.gl);
    }

    initialize(callback) {

        let engine = this;

        let initializableManager = new InitializableManager();
        initializableManager.add(this.skyboxRenderer);
        initializableManager.add(this.terrainRenderer);
        initializableManager.add(this.entityRenderer);
        initializableManager.initialize(function() {

            let viewDistance = 64;
            engine.camera.setFar = viewDistance;

            let fogColor = new Vector3(0.8, 0.83, 0.92, 1);
            engine.gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1);

            engine.terrainRenderer.useShaderProgram();
            engine.sunDirection = new Vector3(-1, -1, -1);
            engine.sunColor = new Vector3(1, 1, 1);
            engine.viewDistance = viewDistance;
            engine.fogFactor = 2;
            engine.fogColor = fogColor;

            callback();
        });
    }

    set sunDirection(vector) {
        this.terrainRenderer.useShaderProgram();
        this.terrainRenderer.sunDirectionUniform.write(vector);
        this.entityRenderer.useShaderProgram();
        this.entityRenderer.sunDirectionUniform.write(vector);
    }

    set sunColor(vector) {
        this.terrainRenderer.useShaderProgram();
        this.terrainRenderer.sunColorUniform.write(vector);
        this.entityRenderer.useShaderProgram();
        this.entityRenderer.sunColorUniform.write(vector);
    }

    set viewDistance(value) {
        this.terrainRenderer.useShaderProgram();
        this.terrainRenderer.viewDistanceUniform.write(value);
        this.entityRenderer.useShaderProgram();
        this.entityRenderer.viewDistanceUniform.write(value);
    }

    set fogFactor(value) {
        this.terrainRenderer.useShaderProgram();
        this.terrainRenderer.fogFactorUniform.write(value);
        this.entityRenderer.useShaderProgram();
        this.entityRenderer.fogFactorUniform.write(value);
    }

    set fogColor(vector) {
        this.terrainRenderer.useShaderProgram();
        this.terrainRenderer.fogColorUniform.write(vector);
        this.skyboxRenderer.useShaderProgram();
        this.skyboxRenderer.fogColorUniform.write(vector);
        this.entityRenderer.useShaderProgram();
        this.entityRenderer.fogColorUniform.write(vector);
    }

    render() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.skyboxRenderer.render(this.camera);
        this.terrainRenderer.render(this.camera);
        this.entityRenderer.render(this.camera);
    }

    setViewPort(x, y, width, height) {

        this.gl.viewport(x, y, width, height);
    }
}
