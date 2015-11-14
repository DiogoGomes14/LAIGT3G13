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

    this.primitives = [];
    this.activeAnimations = [];

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

    console.log(this.activeAnimations);
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
        var animation = null;

        for (var i = 0; i < node.animations.length; i++) {
            animation = this.animations[node.animations[i]];

            if (animation == null) {
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

        if (animations != undefined) {
            animation = animations[0];
            animation.active = true;
            this.activeAnimations.push(animation);
        }
    }

    console.log(animations);

    for (var descendantIndex in node.descendants) {
        if (node.descendants.hasOwnProperty(descendantIndex)) {
            var descendantName = node.descendants[descendantIndex];

            var leaf = this.lsxLeaves[descendantName];

            if (leaf !== undefined) { //This node is a leaf so push its transformations and appearance
                var primitive = this.objects[descendantName];
                var tex = this.lsxTextures[texture];
                var mat = this.lsxMaterials[material];
                anim = null;

                if (mat === undefined) {
                    mat = this.defaultMaterial;
                }

                if (tex === undefined) {
                    tex = null;
                }

                if (animations.length > 0) {
                    var anim = animations[0];
                    anim.active = true;
                    //this.activeAnimations.push(anim);
                }

                this.primitives.push(
                    {
                        'primitive': primitive,
                        'matrix': matrix,
                        'material': mat,
                        'texture': tex,
                        'animations': animations,
                        'animation': anim,
                        'nAnimation': 0
                    }
                );
            }
            else { //This is a intermediate node so calculate the matrix, texture and material to send to its child
                var nodeDesc = this.graph.nodes[descendantName];

                if (nodeDesc !== undefined) { //There is a node

                    // multiply the matrix of the upperNode by this node matrix
                    var newMatrix = mat4.create();
                    mat4.multiply(newMatrix, matrix, nodeDesc.m);

                    this.computeGraph(nodeDesc, newMatrix, material, texture, animations);
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
    if (texture != null) {
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
            var primitive = this.primitives[i];
            var matrix = new mat4.create();

            if (primitive.animation != null) {
                mat4.multiply(matrix, primitive.animation.matrix, primitive.matrix);

                if (!primitive.animation.active) {
                    if (primitive.nAnimation < primitive.animations.length - 1) {

                        var index = this.activeAnimations.indexOf(primitive.animation);
                        if (index > -1) {
                            this.activeAnimations.splice(index, 1);
                        }

                        primitive.nAnimation++;
                        primitive.animation = primitive.animations[primitive.nAnimation];
                        primitive.animation.active = true;

                        if (!(this.activeAnimations.indexOf(primitive.animation) > -1)) {
                            this.activeAnimations.push(primitive.animation);
                        }
                    }
                    else {
                        primitive.animation = null;
                    }
                }
            } else {
                matrix = primitive.matrix;
            }

            this.displayPrimitive(
                primitive.primitive,
                matrix,
                primitive.material,
                primitive.texture
            );
        }
    }
};

XMLscene.prototype.update = function (currTime) {
    if (this.graph.loadedOk) {
        for (var i = 0; i < this.activeAnimations.length; i++) {
            var animation = this.activeAnimations[i];

            if (!animation.active) {
                break;
            }
            //TODO fix the order of the animations using priority
            //console.log(animation.time, i);
            animation.time += this.updatePeriod / 1000;
            animation.timeVector += this.updatePeriod / 1000;

            animation.matrix = animation.animation.update(animation.time, animation.timeVector, animation.nVector);

            if (animation.animation.type == "Linear" && animation.timeVector >= animation.animation.duration * animation.animation.vectors[animation.nVector].l / animation.animation.distance) {
                animation.nVector++;
                animation.timeVector = 0;
            }

            if (animation.time >= animation.animation.duration) {
                animation.time = 0;
                animation.nVector = 0;
                animation.timeVector = 0;
                animation.active = false;
            }
        }
    }
};