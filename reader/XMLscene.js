
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);


	this.axis=new CGFaxis(this);
    //console.log(this.axis);
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();

/*
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
*/

    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
    //TODO add the scale from INITIALS
    //TODO apply doubleside from ilumination

    this.camera.setPosition(vec3.fromValues(this.graph.initials.translate.x, this.graph.initials.translate.y, this.graph.initials.translate.z));
    this.camera.near = this.graph.initials.frustum.near;
    this.camera.far = this.graph.initials.frustum.far;
    this.camera.orbit(this.graph.initials.rotate1.axis, this.graph.initials.rotate1.angle);
    this.camera.orbit(this.graph.initials.rotate2.axis, this.graph.initials.rotate2.angle);
    this.camera.orbit(this.graph.initials.rotate3.axis, this.graph.initials.rotate3.angle);

    this.lights = this.graph.lights;

    this.setGlobalAmbientLight(
        this.graph.ilumination.ambient.r,
        this.graph.ilumination.ambient.g,
        this.graph.ilumination.ambient.b,
        this.graph.ilumination.ambient.a
    );
    this.gl.clearColor(
        this.graph.ilumination.background.r,
        this.graph.ilumination.background.g,
        this.graph.ilumination.background.b,
        this.graph.ilumination.background.a
    );

    this.axis = new CGFaxis(this,this.graph.initials.reference);
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
        for(var light in this.lights){
            if(this.lights.hasOwnProperty(light)){
                this.lights[light].update();
            }
        }
	}

    this.shader.unbind();
};

