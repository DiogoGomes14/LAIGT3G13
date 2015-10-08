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

    this.axis = new CGFaxis(this);

    this.enableTextures(true);

    this.a = 0;
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();


    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].update();

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

    //INITIALS
    this.camera.near = this.lsxInitials.frustum.near;
    this.camera.far = this.lsxInitials.frustum.far;

    this.pushMatrix();
    this.translate(
        this.lsxInitials.translation.x,
        this.lsxInitials.translation.y,
        this.lsxInitials.translation.z
    );
    this.rotate(
        this.lsxInitials.rotate1.axis,
        this.lsxInitials.rotate1.angle
    );
    this.rotate(
        this.lsxInitials.rotate2.axis,
        this.lsxInitials.rotate2.angle
    );
    this.rotate(
        this.lsxInitials.rotate3.axis,
        this.lsxInitials.rotate3.angle
    );
    this.scale(
        this.lsxInitials.scale.sx,
        this.lsxInitials.scale.sy,
        this.lsxInitials.scale.sz
    );
    this.popMatrix();

    this.axis = new CGFaxis(this, this.lsxInitials.reference);

    //ILUMINATION
    this.setGlobalAmbientLight(
        this.lsxIlumination.ambient.r,
        this.lsxIlumination.ambient.g,
        this.lsxIlumination.ambient.b,
        this.lsxIlumination.ambient.a
    );
    this.gl.clearColor(
        this.lsxIlumination.background.r,
        this.lsxIlumination.background.g,
        this.lsxIlumination.background.b,
        this.lsxIlumination.background.a
    );


    //LIGHTS
    //this.lights = this.graph.lights;

    //OBJECTS
    this.rectangle = new MyRectangle(
        this,
        this.lsxLeaves["rectangle"].args[0],
        this.lsxLeaves["rectangle"].args[1],
        this.lsxLeaves["rectangle"].args[2],
        this.lsxLeaves["rectangle"].args[3]
    );

    this.cylinder = new MyCylinder(
        this,
        this.lsxLeaves["cylinder"].args[0],
        this.lsxLeaves["cylinder"].args[1],
        this.lsxLeaves["cylinder"].args[2],
        this.lsxLeaves["cylinder"].args[3],
        this.lsxLeaves["cylinder"].args[4]
    );

    this.sphere = new MySphere(
        this,
        this.lsxLeaves["sphere"].args[0],
        this.lsxLeaves["sphere"].args[1],
        this.lsxLeaves["sphere"].args[2]
    );

    //console.log(this.graph);
};

XMLscene.prototype.displayGraph = function (nodeName, matrix, material, texture) {
    for(var descendantIndex in this.graph[nodeName].descendants){
        if(this.graph[nodeName].descendants.hasOwnProperty(descendantIndex)){
            var descendantName = this.graph[nodeName].descendants[descendantIndex];

            var leafIndex = this.lsxLeaves[descendantName];

            if(leafIndex != undefined){ //Its a leaf so draw this primitive
                this.displayPrimitive(leafIndex, matrix, material, texture);
            }
            else {

                var descendantNode = this.graph[descendantName];

                if(descendantNode != undefined){

                    if (descendantNode.texture === "clear"){
                        texture = "clear";
                    }
                    else if (descendantNode.texture !== "null"){

                        if(this.lsxTextures[descendantNode.texture] != undefined){
                            texture = descendantNode.texture;
                        }
                        else {
                            console.error("There is no texture named " + descendantNode.texture + " (at " +
                                descendantName + ").");
                        }
                    }

                    if(descendantNode.material != "null"){
                        if(this.lsxMaterials[descendantNode.material] != undefined){
                            material = descendantNode.material;
                        }
                        else {
                            console.error("There is no material named " + descendantNode.material + " (at " +
                                descendantName + ").");
                        }
                    }

                    var newMatrix = mat4.create();
                    mat4.multiply(newMatrix, matrix, descendantNode.m);

                    this.displayGraph(descendantName, newMatrix, material, texture);
                }
                else{
                    console.error("There is no node named " + descendantName + ". " +
                        "The parent calling this node is " + nodeName);
                }
            }
        }
    }
};

XMLscene.prototype.displayPrimitive = function (index, matrix, materialName, textureName) {
    /*
    TODO need to add support for amplification factor in the textures.
    TODO need to be able to choose the primitive based on the index of that object (maybe be changed to name).
    TODO fix the cylinder to support different bottom and top heights, as well as fixing the textures.
    TODO fix the sphere. Probably needs to be redone.
    TODO add support for the triangle primitives. File is there but its incomplete.
    TODO choose a scene to implement
     */
    var texture = this.lsxTextures[textureName].texture;
    var material = this.lsxMaterials[materialName];

    material.setTexture(texture);

    if(material == undefined){
        console.error("There is no material named A");
    }

    if(texture == undefined){
        console.error("There is no texture named A");
    }

    this.pushMatrix();
        material.apply();
        this.multMatrix(matrix);
        this.rectangle.display();
    this.popMatrix();
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
    if (this.graph.loadedOk) {
        for (var light in this.lights) {
            if (this.lights.hasOwnProperty(light)) {
                this.lights[light].update();
            }
        }

        //if(this.a == 0){
            var rootName = this.graph["root"];
            if(rootName == undefined){
                console.error("Couldn't find root in the nodes!!");
            }
            var root = this.graph[rootName];
            this.displayGraph(rootName, root.m, root.material, root.texture);
        //} this.a++;
    }

    this.shader.unbind();
};

