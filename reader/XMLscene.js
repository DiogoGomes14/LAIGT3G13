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
    this.types = [];


    //this.sTextures = [];
    //this.sMaterials = [];
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

    var root = this.graph.nodes[this.graph["root"]];

    if(root == undefined){
        console.error("Couldn't find root in the nodes!!");
    }

    this.computeGraph(root, root.m, root.material, root.texture);
    /*console.dir(this.textures);
    console.dir(this.sTextures);
    console.dir(this.materials);
    console.dir(this.sMaterials);*/
};

XMLscene.prototype.computeGraph = function (upperNode, matrix, material, texture) {
    for(var descendantIndex in upperNode.descendants){
        if(upperNode.descendants.hasOwnProperty(descendantIndex)){
            var descendantName = upperNode.descendants[descendantIndex];

            var leaf = this.lsxLeaves[descendantName];

            if(leaf !== undefined){ //This node is a leaf so push its transformations and appearance
                var primitive = this.objects[descendantName];
                var tex = this.lsxTextures[texture];
                var mat = this.lsxMaterials[material];

                /*
                var tex = this.lsxTextures[this.sTextures.pop()];
                var mat = this.lsxMaterials[this.sMaterials.pop()];
                */

                if(mat === undefined) {
                    mat = this.defaultMaterial;
                }

                if(tex === undefined){
                    tex = null;
                }

                this.primitives.push(primitive);
                this.primitiveMatrix.push(matrix);
                this.materials.push(mat);
                this.textures.push(tex);
                this.types.push(leaf.type);
            }
            else { //This is a intermediate node so calculate the matrix, texture and material to send to its child
                var node = this.graph.nodes[descendantName];

                if(node !== undefined){ //There is a node
                    if (node.texture === "clear"){ // Ignore the texture from the parent
                        if(texture !== "clear"){
                            texture = "clear";
                        }
                    } else if (node.texture !== "null"){ //Change the texture to this node texture
                        if(this.lsxTextures[node.texture] !== undefined) //if the texture is found
                            texture = node.texture;
                        else
                            console.error("There is no texture named " + node.texture + " (at " + descendantName + ").");
                    }

                    if(node.material !== "null"){ //Change the material to this node material
                        if(this.lsxMaterials[node.material] !== undefined)
                            material = node.material;
                        else
                            console.error("There is no material named " + node.material + " (at " + descendantName + ").");
                    }

                    // multiply the matrix of the upperNode by this node matrix
                    var newMatrix = mat4.create();
                    mat4.multiply(newMatrix, matrix, node.m);

                    /*
                    this.sMaterials.push(material);
                    this.sTextures.push(texture);
                    */

                    //calculate the transformations of the descendants of node
                    this.computeGraph(node, newMatrix, material, texture);

                    /*
                    this.sMaterials.pop();
                    this.sTextures.pop();
                    */
                }
                else{
                    console.error("There is no node named " + descendantName + ". " +
                        "The parent calling this node is " + upperNode);
                }
            }
        }
    }
};

XMLscene.prototype.displayPrimitive = function (primitive, matrix, material, texture, type) {
    //TODO fix texture application (with a stack, using push and pop)
    //When an object is supposed to have no texture, the last one used is applied on this object

    //only change the amplification factor of the primitives of type rectangle or triangle
    if ((type === "rectangle" || type === "triangle") && texture != null){
        primitive.updateTexCoords(texture.amp_factor.s, texture.amp_factor.t);
        primitive.updateTexCoordsGLBuffers();
    }
    if(texture != null){
        texture = texture.texture;
    }

    //draw the primitive with the calculated transformations/appearance
    this.pushMatrix();
        this.multMatrix(this.initialMatrix);
        this.multMatrix(matrix);
        material.setTexture(texture);
        material.apply();
        primitive.display();
    this.popMatrix();

    //reset the texture of the appearance
    material.setTexture(null);
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

        //display each primitive with the appropriate transformations/appearance
        for(var i = 0; i < this.primitives.length; i++){
            this.displayPrimitive(
                this.primitives[i],
                this.primitiveMatrix[i],
                this.materials[i],
                this.textures[i],
                this.types[i]
            );
        }
    }

    this.shader.unbind();
};