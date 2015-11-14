function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.application = application;
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
    this.primitiveAnimations = [];
    this.primitiveActiveAnimations = [];

    this.setUpdatePeriod(1000 / 60);
};

XMLscene.prototype.initLights = function () {
    this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].update();
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
        this.lsxInitials.rotate3.angle * Math.PI / 180,
        [
            this.lsxInitials.rotate3.axis == "x" ? 1 : 0,
            this.lsxInitials.rotate3.axis == "y" ? 1 : 0,
            this.lsxInitials.rotate3.axis == "z" ? 1 : 0
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
        this.lsxInitials.rotate1.angle * Math.PI / 180,
        [
            this.lsxInitials.rotate1.axis == "x" ? 1 : 0,
            this.lsxInitials.rotate1.axis == "y" ? 1 : 0,
            this.lsxInitials.rotate1.axis == "z" ? 1 : 0
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

    //OBJECTS
    this.objects = [];
    for (var leaf in this.lsxLeaves) {
        if (this.lsxLeaves.hasOwnProperty(leaf)) {
            if (this.lsxLeaves[leaf].type === "rectangle") {

                this.objects[leaf] =
                    new MyRectangle(
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

            } else if (this.lsxLeaves[leaf].type === "cylinder") {

                this.objects[leaf] =
                    new MyCylinder(
                        this,
                        this.lsxLeaves[leaf].args[0],
                        this.lsxLeaves[leaf].args[1],
                        this.lsxLeaves[leaf].args[2],
                        this.lsxLeaves[leaf].args[3],
                        this.lsxLeaves[leaf].args[4]
                    );

            } else if (this.lsxLeaves[leaf].type === "sphere") {

                this.objects[leaf] =
                    new MySphere(
                        this,
                        this.lsxLeaves[leaf].args[0],
                        this.lsxLeaves[leaf].args[1],
                        this.lsxLeaves[leaf].args[2]
                    );

            } else if (this.lsxLeaves[leaf].type === "triangle") {

                this.objects[leaf] =
                    new MyTriangle(
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

    if (root == undefined) {
        console.error("Couldn't find root in the nodes!!");
    }

    this.animations = [];

    for (var animationName in this.lsxAnimations) {
        if (this.lsxAnimations.hasOwnProperty(animationName)) {
            var animation = this.lsxAnimations[animationName];

            if (animation.type == "circular") {
                this.animations[animationName] =
                    new CircularAnimation(
                        this,
                        animation.span,
                        animation.radius,
                        animation.center,
                        animation.startAng,
                        animation.rotAng
                    );
            } else if (animation.type == "linear") {
                this.animations[animationName] =
                    new LinearAnimation(
                        this,
                        animation.span,
                        animation.controlPoints
                    );
            }
        }
    }

    this.computeGraph(root, root.m, root.material, root.texture, []);

    console.log(this.primitiveAnimations);
    console.log(this.primitiveActiveAnimations);
};

XMLscene.prototype.computeGraph = function (node, matrix, material, texture, animations) {

    if (node.texture === "clear") { // Ignore the texture from the parent
        if (texture !== "clear") {
            texture = "clear";
        }
    } else if (node.texture !== "null") { //Change the texture to this node texture
        if (this.lsxTextures[node.texture] !== undefined) //if the texture is found
            texture = node.texture;
        else
            console.error("There is no texture named " + node.texture + ".");
    }

    if (node.material !== "null") { //Change the material to this node material
        if (this.lsxMaterials[node.material] !== undefined)
            material = node.material;
        else
            console.error("There is no material named " + node.material + ".");
    }

    if (node.animations.length != 0) {
        var priority = 0;

        for (var i = 0; i < node.animations.length; i++) {
            var animation = this.animations[node.animations[i]];

            if(animation == null){
                console.error("Animations " + node.animations[i] + " doesn't exist.");
                break;
            }

            animations.push(
                {
                    'animation': animation,
                    'priority': priority,
                    'active': false,
                    'time': 0,
                    'nVector': 0,
                    'timeVector': 0,
                    'matrix': false
                }
            );
            priority++;
        }
    }

    for (var descendantIndex in node.descendants) {
        if (node.descendants.hasOwnProperty(descendantIndex)) {
            var descendantName = node.descendants[descendantIndex];

            var leaf = this.lsxLeaves[descendantName];

            if (leaf !== undefined) { //This node is a leaf so push its transformations and appearance
                var primitive = this.objects[descendantName];
                var tex = this.lsxTextures[texture];
                var mat = this.lsxMaterials[material];

                if (mat === undefined) {
                    mat = this.defaultMaterial;
                }

                if (tex === undefined) {
                    tex = null;
                }
                animations[0].active = true;

                this.primitives.push(primitive);
                this.primitiveMatrix.push(matrix);
                this.materials.push(mat);
                this.textures.push(tex);
                this.primitiveAnimations.push(animations);
                this.primitiveActiveAnimations.push(animations[0]);
            }
            else { //This is a intermediate node so calculate the matrix, texture and material to send to its child
                var nodeDesc = this.graph.nodes[descendantName];

                if (nodeDesc !== undefined) { //There is a node

                    // multiply the matrix of the upperNode by this node matrix
                    var newMatrix = mat4.create();
                    mat4.multiply(newMatrix, matrix, nodeDesc.m);

                    this.computeGraph(nodeDesc, newMatrix, material, texture);
                }
                else {
                    console.error("There is no node named " + descendantName + ". " +
                        "The parent calling this node is " + node);
                }
            }
        }
    }
};

XMLscene.prototype.displayPrimitive = function (primitive, matrix, material, texture) {

    //change the amplification factor of the primitives
    if(texture != null){
        primitive.updateTexCoords(texture.amp_factor.s, texture.amp_factor.t);
        primitive.updateTexCoordsGLBuffers();
    }
    if (texture != null) {
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

                //if the check on the gui is true, enable light, else disable
                if (this[this.lights[light].name]) {
                    this.lights[light].enable();
                } else {
                    this.lights[light].disable();
                }

                this.lights[light].update();
            }
        }

        //display each primitive with the appropriate transformations/appearance

        for (var i = 0; i < this.primitives.length; i++) {
            var matrix = new mat4.create();
            //console.log(this.primitiveActiveAnimations[i]);
            mat4.multiply(matrix, this.primitiveActiveAnimations[i].matrix, this.primitiveMatrix[i]);

            this.displayPrimitive(
                this.primitives[i],
                matrix,
                this.materials[i],
                this.textures[i]
            );
        }
    }
};

XMLscene.prototype.update = function (currTime) {
    if (this.graph.loadedOk) {
        for(var i = 0; i < this.primitiveActiveAnimations.length; i++){
            var anim = this.primitiveActiveAnimations[i];
            console.log(anim);
            if(anim != null){

                anim.time += this.updatePeriod / 1000;
                anim.timeVector += this.updatePeriod / 1000;

                anim.matrix = anim.animation.update(anim.time, anim.timeVector, anim.nVector);
                console.log();

                if (anim.timeVector >= anim.animation.duration * anim.animation.vectors[anim.nVector].l / anim.animation.distance) {
                    anim.nVector++;
                    anim.timeVector = 0;
                }

                if(anim.time > anim.animation.distance){
                    this.primitiveActiveAnimations[i] = null;
                    for(var j = 0; j < this.primitiveAnimations[i].length - 1; j++){
                        if(this.primitiveAnimations[i][j].active){
                            this.primitiveAnimations[i][j].active = false;
                            this.primitiveAnimations[i][j + 1].active = true;
                            this.primitiveActiveAnimations[i] = this.primitiveAnimations[i][j + 1];
                        }
                    }
                }
            }
        }
    }
};