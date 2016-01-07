function XMLscene() {
    CGFscene.call(this);
    this.texture = null;
    this.appearance = null;

}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.application = application;
    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(1000.0);
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

    this.appearance = new CGFappearance(this);
    this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.appearance.setShininess(120);

    this.setUpdatePeriod(1000 / 60);

    // font texture: 16 x 16 characters
    // http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
    this.fontTexture = new CGFtexture(this, "scenes/images/oolite-font.png");
    this.appearance.setTexture(this.fontTexture);

    // plane where texture character will be rendered
    this.plane = new Plane(this);

    // instatiate text shader
    this.textShader = new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");

    // set number of rows and columns in font texture
    this.textShader.setUniformsValues({'dims': [16, 16]});

    //this.piece = new Piece(this);

    this.setPickEnabled(true);

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
    this.setAmbient(0.1, 0.1, 0.1, 1.0);
    this.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {

    this.initInitials();
    this.initObjects();
    this.initAnimations();
    this.initGame();
    this.initLsxLights();

    //Get the root node and compute the graph
    var root = this.graph.nodes[this.graph["root"]];

    if (root == undefined) {
        console.error("Couldn't find root in the nodes!!");
    }

    this.calculateGraph(root, root.m, root.material, root.texture, []);
};

XMLscene.prototype.initLsxLights = function () {

    var i = 0;
    for (var light in this.lsxLights) {
        if (this.lsxLights.hasOwnProperty(light)) {
            this.lights[i].setPosition(
                this.lsxLights[light].position.x,
                this.lsxLights[light].position.z,
                this.lsxLights[light].position.z,
                this.lsxLights[light].position.w
            );
            this.lights[i].setAmbient(
                this.lsxLights[light].ambient.r,
                this.lsxLights[light].ambient.g,
                this.lsxLights[light].ambient.b,
                this.lsxLights[light].ambient.a
            );
            this.lights[i].setDiffuse(
                this.lsxLights[light].diffuse.r,
                this.lsxLights[light].diffuse.g,
                this.lsxLights[light].diffuse.b,
                this.lsxLights[light].diffuse.a
            );
            this.lights[i].setSpecular(
                this.lsxLights[light].specular.r,
                this.lsxLights[light].specular.g,
                this.lsxLights[light].specular.b,
                this.lsxLights[light].specular.a
            );
            this.lights[i].name = light;

            if (this.lsxLights[light].enable) {
                this[light] = true;
                this.lights[i].enable();
            } else {
                this[light] = false;
            }

            this.application.interface.addLightsSwitch(light);
            i++;
        }
    }
};

XMLscene.prototype.initAnimations = function () {
    //ANIMATIONS
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
};

XMLscene.prototype.initObjects = function () {

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

            } else if (this.lsxLeaves[leaf].type === "plane") {

                this.objects[leaf] =
                    new Plane(
                        this,
                        this.lsxLeaves[leaf].parts
                    );

            } else if (this.lsxLeaves[leaf].type === "patch") {

                this.objects[leaf] =
                    new Patch(
                        this,
                        this.lsxLeaves[leaf].partsU,
                        this.lsxLeaves[leaf].partsV,
                        this.lsxLeaves[leaf].order,
                        this.lsxLeaves[leaf].order,
                        this.lsxLeaves[leaf].controlPoints
                    );

            } else if (this.lsxLeaves[leaf].type === "terrain") {

                this.objects[leaf] =
                    new Terrain(
                        this,
                        this.lsxLeaves[leaf].texture,
                        this.lsxLeaves[leaf].heightmap
                    );

            } else if (this.lsxLeaves[leaf].type === "vehicle") {
                this.objects[leaf] = new Vehicle(this);
            } else
                console.error("there is no primitive type named " + leaf);
        }
    }
};

XMLscene.prototype.initInitials = function () {

    this.camera.near = this.lsxInitials.frustum.near;
    this.camera.far = this.lsxInitials.frustum.far;

    this.initialMatrix = mat4.create();
    mat4.identity(this.initialMatrix);
    mat4.translate(
        this.initialMatrix,
        this.initialMatrix,
        [
            this.lsxInitials.translation.x,
            this.lsxInitials.translation.z,
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
};

XMLscene.prototype.initGame = function () {

    this.game = new Spangles(this);

    this.game.requestAvailablePlays();

    this.quitSICSTUS = function () {
        this.game.terminateConnection();
    };
    this.application.interface.addGameThing("quitSICSTUS");

    this.topView = function () {
        //this.camera.pan([-1,0,0]);
        this.camera.setPosition([0.01,40,0.01]);
        this.camera.setTarget([0,0,0]);
    };
    this.application.interface.addGameThing("topView");


    this.topViewFar = function () {
        //this.camera.pan([-1,0,0]);
        this.camera.setPosition([0.01,100,0.01]);
        this.camera.setTarget([0,0,0]);
    };
    this.application.interface.addGameThing("topViewFar");

    this.undoMove = function () {

        if(this.game.boardHistory.length > 0){
            this.game.undoMove();
        }
    };
    this.application.interface.addGameThing("undoMove");

    return true;
};

XMLscene.prototype.calculateGraph = function (node, matrix, material, texture, animations) {

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

            var obj = {
                'animation': animation,
                'priority': priority,
                'active': false,
                'time': 0,
                'nVector': 0,
                'timeVector': 0,
                'matrix': false
            };

            animations.push(obj);
            this.activeAnimations.push(obj);

            priority++;
        }
    }

    for (var descendantIndex in node.descendants) {
        if (node.descendants.hasOwnProperty(descendantIndex)) {
            var descendantName = node.descendants[descendantIndex];

            var leaf = this.lsxLeaves[descendantName];

            if (leaf !== undefined) { //This node is a leaf so push its transformations and appearance

                this.pushPrimitive(descendantName, matrix, material, texture, animations);

            } else { //This is a intermediate node so calculate the matrix, texture and material to send to its child
                var nodeDesc = this.graph.nodes[descendantName];

                if (nodeDesc !== undefined) { //There is a node

                    // multiply the matrix of the upperNode by this node matrix
                    var newMatrix = mat4.create();
                    mat4.multiply(newMatrix, matrix, nodeDesc.m);

                    var oldanims = [];
                    for (var a in animations) {
                        oldanims.push(animations[a]);
                    }
                    this.calculateGraph(nodeDesc, newMatrix, material, texture, animations);
                    animations = oldanims;
                }
                else {
                    console.error("There is no node named " + descendantName + ". " +
                        "The parent calling this node is " + node);
                }
            }
        }
    }
};

XMLscene.prototype.pushPrimitive = function (primitiveName, matrix, material, texture, animations) {
    var primitive = this.objects[primitiveName];
    var tex = this.lsxTextures[texture];
    var mat = this.lsxMaterials[material];

    if (mat === undefined) {
        mat = this.defaultMaterial;
    }

    if (tex === undefined) {
        tex = null;
    }

    for (var index in animations) {
        var anim = animations[index];
        if (anim.priority == 0) {
            anim.active = true;
        }
    }

    this.primitives.push(
        {
            'primitive': primitive,
            'matrix': matrix,
            'animMatrix': new mat4.create(),
            'material': mat,
            'texture': tex,
            'animations': animations,
            'priority': 0,
            'nAnimationsFinished': 0
        }
    );
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

//display each primitive with the appropriate transformations/appearance
XMLscene.prototype.displayObject = function () {

    for (var i = 0; i < this.primitives.length; i++) {
        var primitive = this.primitives[i];
        var matrix = new mat4.create();

        if (primitive.nAnimationsFinished < primitive.animations.length) {
            primitive.animMatrix = new mat4.create();

            for (var j = 0; j < primitive.animations.length; j++) {
                var animation = primitive.animations[j];

                if (animation.active) {
                    mat4.multiply(primitive.animMatrix, animation.matrix, primitive.animMatrix);
                    //mat4.multiply(matrix, animation.matrix, primitive.matrix);
                }

                if (animation.time >= animation.animation.duration) {
                    animation.time = 0;
                    animation.nVector = 0;
                    animation.timeVector = 0;
                    animation.active = false;

                    if (primitive.animations[j + 1] != undefined && primitive.animations[j + 1].priority > animation.priority) {
                        primitive.animations[j + 1].active = true;
                        primitive.nAnimationsFinished++;
                    }
                }
            }
        }

        mat4.multiply(matrix, primitive.animMatrix, primitive.matrix);

        //mat4.multiply(matrix, primitive.animMatrix, primitive.matrix);

        if (primitive.animations.length == 0) {
            matrix = primitive.matrix;
        }

        this.displayPrimitive(
            primitive.primitive,
            matrix,
            primitive.material,
            primitive.texture
        );
    }
};

XMLscene.prototype.update = function (currTime) {
    if (this.graph.loadedOk) {
        //console.log(this.activeAnimations);
        for (var i = 0; i < this.activeAnimations.length; i++) {
            var animation = this.activeAnimations[i];

            if (!animation.active) {
                continue;
            }

            animation.time += this.updatePeriod / 1000;
            animation.timeVector += this.updatePeriod / 1000;

            animation.matrix = animation.animation.update(animation.time, animation.timeVector, animation.nVector);

            if (animation.animation.type == "Linear" && animation.timeVector >= animation.animation.duration * animation.animation.vectors[animation.nVector].l / animation.animation.distance) {
                animation.nVector++;
                animation.timeVector = 0;
            }
        }
    }
};

XMLscene.prototype.display = function () {
    this.logPicking();
    this.clearPickRegistration();

    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();


    // An example of how to show something that is not affected by the camera (e.g. a HUP display)
    /*this.pushMatrix();
    this.translate(-1, 1.5, -10);
    this.plane.display();
    this.popMatrix();
*/

    if (this.graph.loadedOk) {
        if(this.game.gameOver){
            // activate shader for rendering text characters
            this.setActiveShaderSimple(this.textShader);
            this.game.displayEndText();
            this.setActiveShaderSimple(this.defaultShader);
        }
    }

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

        //this.displayObject();

        this.processGame();

    }

/*
    // activate shader for rendering text characters
    this.setActiveShaderSimple(this.textShader);

    // activate texture containing the font
    this.appearance.apply();

    this.pushMatrix();

    //this.scale(10,10,10);

    // set character to display to be in the 6th column, 5th line (0-based)
    // the shader will take care of computing the correct texture coordinates
    // of that character inside the font texture (check shaders/font.vert )
    // Homework: This should be wrapped in a function/class for displaying a full string

    this.activeShader.setUniformsValues({'charCoords': [12, 4]});
    this.plane.display();

    this.translate(1, 0, 0);
    this.activeShader.setUniformsValues({'charCoords': [1, 4]});
    this.plane.display();

    this.translate(1, 0, 0);
    this.activeShader.setUniformsValues({'charCoords': [9, 4]});
    this.plane.display();

    this.translate(1, 0, 0);
    this.activeShader.setUniformsValues({'charCoords': [7, 4]});
    this.plane.display();

    this.popMatrix();

    this.setActiveShaderSimple(this.defaultShader);*/
};

XMLscene.prototype.processGame = function () {

    this.game.processGame();

    this.appearance.setTexture(null);
    this.appearance.apply();

    this.game.display();

    this.appearance.setTexture(this.fontTexture);
    this.appearance.apply();
};

XMLscene.prototype.logPicking = function () {
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i=0; i< this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];
                if (obj)
                {
                    var customId = this.pickResults[i][1];
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                    //console.log(obj);
                    if(!this.game.gameOver){
                        this.game.pickPiece(obj);
                    }
                }
            }
            this.pickResults.splice(0,this.pickResults.length);
        }
    }
}