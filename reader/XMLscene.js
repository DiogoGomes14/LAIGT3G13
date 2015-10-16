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

    this.defaultMaterial = new CGFappearance(this);
    this.defaultMaterial.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.defaultMaterial.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.defaultMaterial.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.defaultMaterial.setShininess(10.0);

    this.materials = [];
    this.textures = [];
    this.primitives = [];
    this.primitiveMatrix = [];
    this.stupidTextures = [];
    this.stupidMaterials = [];

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

    this.initialMatrix = mat4.create();
    mat4.identity(this.initialMatrix);
    mat4.translate(
        this.initialMatrix,
        this.initialMatrix,
        [
            this.lsxInitials.translation.x,
            this.lsxInitials.translation.y,
            this.lsxInitials.translation.z
        ]
    );

    mat4.rotate(
        this.initialMatrix,
        this.initialMatrix,
        this.lsxInitials.rotate1.angle * Math.PI / 180,
        [
            this.lsxInitials.rotate1.axis == "x" ? 1 : 0,
            this.lsxInitials.rotate1.axis == "y" ? 1 : 0,
            this.lsxInitials.rotate1.axis == "z" ? 1 : 0
        ]
    );

    mat4.rotate(
        this.initialMatrix,
        this.initialMatrix,
        this.lsxInitials.rotate2.angle * Math.PI / 180,
        [
            this.lsxInitials.rotate2.axis == "x" ? 1 : 0,
            this.lsxInitials.rotate2.axis == "y" ? 1 : 0,
            this.lsxInitials.rotate2.axis == "z" ? 1 : 0
        ]
    );

    mat4.rotate(
        this.initialMatrix,
        this.initialMatrix,
        this.lsxInitials.rotate3.angle * Math.PI / 180,
        [
            this.lsxInitials.rotate3.axis == "x" ? 1 : 0,
            this.lsxInitials.rotate3.axis == "y" ? 1 : 0,
            this.lsxInitials.rotate3.axis == "z" ? 1 : 0
        ]
    );

    mat4.scale(
        this.initialMatrix,
        this.initialMatrix,
        [
            this.lsxInitials.scale.sx,
            this.lsxInitials.scale.sy,
            this.lsxInitials.scale.sz
        ]
    );

    //ILLUMINATION
    this.setGlobalAmbientLight(
        this.lsxIllumination.ambient.r,
        this.lsxIllumination.ambient.g,
        this.lsxIllumination.ambient.b,
        this.lsxIllumination.ambient.a
    );
    this.gl.clearColor(
        this.lsxIllumination.background.r,
        this.lsxIllumination.background.g,
        this.lsxIllumination.background.b,
        this.lsxIllumination.background.a
    );

    this.axis = new CGFaxis(this, this.lsxInitials.reference);

    //LIGHTS
    //this.lights = this.graph.lights;

    //OBJECTS
    this.objects = [];
    for(var leaf in this.lsxLeaves){
        if(this.lsxLeaves.hasOwnProperty(leaf)){
            if(this.lsxLeaves[leaf].type === "rectangle"){
                this.objects[leaf] = new MyRectangle(
                    this,
                    [
                        this.lsxLeaves[leaf].args[0],
                        this.lsxLeaves[leaf].args[1]
                    ],
                    [
                        this.lsxLeaves[leaf].args[2],
                        this.lsxLeaves[leaf].args[3]
                    ]
                );
            } else if(this.lsxLeaves[leaf].type === "cylinder"){
                this.objects[leaf] = new MyCylinder(
                    this,
                    this.lsxLeaves[leaf].args[0],
                    this.lsxLeaves[leaf].args[1],
                    this.lsxLeaves[leaf].args[2],
                    this.lsxLeaves[leaf].args[3],
                    this.lsxLeaves[leaf].args[4]
                );
            } else if(this.lsxLeaves[leaf].type === "sphere"){
                this.objects[leaf] = new MySphere(
                    this,
                    this.lsxLeaves[leaf].args[0],
                    this.lsxLeaves[leaf].args[1],
                    this.lsxLeaves[leaf].args[2]
                );
            } else if(this.lsxLeaves[leaf].type === "triangle"){
                this.objects[leaf] = new MyTriangle(
                    this,
                    [
                        this.lsxLeaves[leaf].args[0],
                        this.lsxLeaves[leaf].args[1],
                        this.lsxLeaves[leaf].args[2]
                    ],
                    [
                        this.lsxLeaves[leaf].args[3],
                        this.lsxLeaves[leaf].args[4],
                        this.lsxLeaves[leaf].args[5]
                    ],
                    [
                        this.lsxLeaves[leaf].args[6],
                        this.lsxLeaves[leaf].args[7],
                        this.lsxLeaves[leaf].args[8]
                    ]
                );
            } else
                console.error("there is no primitive type named " + leaf);
        }
    }

    var rootName = this.graph["root"];
    if(rootName == undefined){
        console.error("Couldn't find root in the nodes!!");
    }
    var root = this.graph.nodes[rootName];

    this.displayGraph(rootName, root.m, root.material, root.texture);
    console.dir(this.stupidTextures);
    console.dir(this.textures);
    console.dir(this.stupidMaterials);
    console.dir(this.materials);
};

XMLscene.prototype.displayGraph = function (nodeName, matrix, material, texture) {
    for(var descendantIndex in this.graph.nodes[nodeName].descendants){
        if(this.graph.nodes[nodeName].descendants.hasOwnProperty(descendantIndex)){
            var descendantName = this.graph.nodes[nodeName].descendants[descendantIndex];

            if(this.lsxLeaves[descendantName] !== undefined){ //Its a leaf so draw this primitive
                if(textureName != "null" && textureName != "clear"){
                    //TODO
                    var texture = this.lsxTextures[textureName].texture;

                    if(texture == undefined){
                        console.error("Couldn't find texture named " + textureName);
                    }

                    if (this.lsxLeaves[primitiveName].type == "rectangle"){
                        this.objects[primitiveName].updateTexCoords(
                            this.lsxTextures[textureName].amp_factor.s,
                            this.lsxTextures[textureName].amp_factor.t
                        );
                    } else if(this.lsxLeaves[primitiveName].type === "triangle") {
                        this.objects[primitiveName].updateTexCoords(
                            this.lsxTextures[textureName].amp_factor.s,
                            this.lsxTextures[textureName].amp_factor.t
                        );
                    }
                    //TODO
                } else {
                    texture = null;
                }

                this.primitives.push(descendantName);
                this.primitiveMatrix.push(matrix);
                this.materials.push(material);
                this.textures.push(texture);
            }
            else {

                var descendantNode = this.graph.nodes[descendantName];

                if(descendantNode !== undefined){

                    if (descendantNode.texture === "clear"){
                        if(texture !== "clear"){
                            this.stupidTextures.pop();
                            texture = "clear";
                        }
                    }
                    else if (descendantNode.texture !== "null"){

                        if(this.lsxTextures[descendantNode.texture] !== undefined){
                            texture = descendantNode.texture;
                        }
                        else {
                            console.error("There is no texture named " + descendantNode.texture + " (at " +
                                descendantName + ").");
                        }
                        this.stupidTextures.push(texture);
                    }

                    if(descendantNode.material !== "null"){
                        if(this.lsxMaterials[descendantNode.material] !== undefined){
                            material = descendantNode.material;
                        }
                        else {
                            console.error("There is no material named " + descendantNode.material + " (at " +
                                descendantName + ").");
                        }
                        this.stupidMaterials.push(material);
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

XMLscene.prototype.displayPrimitive = function (primitiveName, matrix, materialName, textureName) {
    /*
    TODO reformat the code to be simpler. Separate the parser in different objects. Lower priority.
    TODO check if there isnt another parsed thing with the same id
    TODO fix lighting
    */




    this.objects[primitiveName].updateTexCoordsGLBuffers();
    var material = this.lsxMaterials[materialName];
    if(material === undefined) {
        material = this.defaultMaterial;
    }

    this.pushMatrix();
        this.multMatrix(this.initialMatrix);
        this.multMatrix(matrix);
        material.setTexture(texture);
        material.apply();
        this.objects[primitiveName].display();
    this.popMatrix();

    if (this.lsxLeaves[primitiveName].type == "rectangle" || this.lsxLeaves[primitiveName].type === "triangle"){
        this.objects[primitiveName].defaultTexCoords();
    }
    this.objects[primitiveName].updateTexCoordsGLBuffers();
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
        for(var i = 0; i < this.primitives.length; i++){
            this.displayPrimitive(
                this.primitives[i],
                this.primitiveMatrix[i],
                this.materials[i],
                this.textures[i]
            );
        }

        //} this.a++;
    }

    this.shader.unbind();
};