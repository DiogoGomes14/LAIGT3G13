function Node () {
    this.material = null;
    this.texture = null;
    this.m = null;
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
