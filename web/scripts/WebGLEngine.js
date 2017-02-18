include("geometry/Vertex");
include("geometry/Transform");
include("ShaderUniformManager");

include("Camera");
include("Skybox");

include("util/InitializableManager");
include("Renderer");
include("TerrainRenderer");
include("SkyboxRenderer");

class WebGLEngine extends Initializable {

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
    }

    initialize(callback) {

        let engine = this;

        let initializableManager = new InitializableManager();
        initializableManager.add(this.skyboxRenderer);
        initializableManager.add(this.terrainRenderer);
        initializableManager.initialize(function() {

            let viewDistance = 64;
            engine.camera.setFar = viewDistance;

            let fogColor = new Vector3(0.8, 0.83, 0.92, 1);
            engine.gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1);

            engine.terrainRenderer.useShaderProgram();
            engine.terrainRenderer.sunDirection = new Vector3(-1, -1, -1);
            engine.terrainRenderer.sunColor = new Vector3(1, 1, 1);
            engine.terrainRenderer.viewDistance = viewDistance;
            engine.terrainRenderer.fogFactor = 2;
            engine.terrainRenderer.fogColor = fogColor;

            engine.skyboxRenderer.useShaderProgram();
            engine.skyboxRenderer.fogColor = fogColor;

            callback();
        });
    }

    render() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.skyboxRenderer.render(this.camera);
        this.terrainRenderer.render(this.camera);
    }

    setViewPort(x, y, width, height) {

        this.gl.viewport(x, y, width, height);
    }
}
