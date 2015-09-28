
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
XMLscene.prototype.onGraphLoaded = function () 
{
/*
    this.camera = new CGFcamera(0.4, this.graph.initials[0][0], this.graph.initials[0][1], vec3.fromValues(this.graph.initials[1][0], this.graph.initials[1][1], this.graph.initials[1][2]), vec3.fromValues(0, 0, 0));
    this.axis=new CGFaxis(this,this.graph.initials[6]);
    this.camera.rotate(this.graph.initials[2][0], this.graph.initials[2][1]);
    this.camera.rotate(this.graph.initials[3][0], this.graph.initials[3][1]);
    this.camera.rotate(this.graph.initials[4][0], this.graph.initials[4][1]);
*/

    this.gl.clearColor(this.graph.ilumination[2][0],this.graph.ilumination[2][1],this.graph.ilumination[2][2],this.graph.ilumination[2][3]);
    this.setLights();
};

XMLscene.prototype.setLights = function ()
{

    for (var light in this.graph.lightList){
        if (this.graph.lightList.hasOwnProperty(light)) {
            this.lights[light].setPosition(this.graph.lightList[light][1][0], this.graph.lightList[light][1][1], this.graph.lightList[light][1][2], this.graph.lightList[light][1][3]);
            this.lights[light].setAmbient(this.graph.lightList[light][2][0],this.graph.lightList[light][2][1],this.graph.lightList[light][2][2],this.graph.lightList[light][2][3]);
            this.lights[light].setDiffuse(this.graph.lightList[light][3][0],this.graph.lightList[light][3][1],this.graph.lightList[light][3][2],this.graph.lightList[light][3][3]);
            this.lights[light].setSpecular(this.graph.lightList[light][4][0],this.graph.lightList[light][4][1],this.graph.lightList[light][4][2],this.graph.lightList[light][4][3]);
            this.lights[light].setVisible(this.graph.lightList[light][0]);
            this.lights[light].enable();
        }
    }
}

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
		this.lights[0].update();

        this.lights[5].update();
	};	

    this.shader.unbind();
};

