function Node () {
    this.material = null;
    this.texture = null;
    this.m = null;
    this.animations = [];
    this.descendants = [];
}

Node.prototype.push = function(nodeName){
    this.descendants.push(nodeName);
};

Node.prototype.setMaterial = function(material){
    this.material = material;
};

Node.prototype.setTexture = function(texture){
    this.texture = texture;
};

Node.prototype.setMatrix = function(m){
    this.m = mat4.clone(m);
};

Node.prototype.addAnimation = function(animation){
    this.animations.push(animation);
};
/*
Node.prototype.display = function(scene, matrix, material, texture){
    for(var descendantIndex in this.descendants){
        if(this.descendants.hasOwnProperty(descendantIndex)){
            var descendantName = this.descendants[descendantIndex];

            var leaf = scene.lsxLeaves[descendantName];

            if(leaf !== undefined){
                var primitive = scene.objects[descendantName];
                var tex = scene.lsxTextures[texture];
                var mat = scene.lsxMaterials[material];

                if(mat === undefined) {
                    mat = scene.defaultMaterial;
                }

                if(tex === undefined){
                    tex = null;
                }

                primitive.display1(matrix, mat, tex);
            }
            else {
                var node = scene.graph.nodes[descendantName];

                if(node !== undefined){
                    if (node.texture === "clear"){
                        if(texture !== "clear"){
                            texture = "clear";
                        }
                    } else if (node.texture !== "null"){
                        texture = node.texture;
                    }

                    if(node.material !== "null"){
                        material = node.material;
                    }

                    var newMatrix = mat4.create();
                    mat4.multiply(newMatrix, matrix, node.m);

                    node.display(scene, newMatrix, material, texture);
                }
            }
        }
    }
};*/