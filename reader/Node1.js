function Node () {
    this.material = null;
    this.texture = null;
    this.m = null;
    this.descendants = [];
}

Node.property.push = function(nodeName){
    this.descendants.push(nodeName);
};

Node.property.setMaterial = function(material){
    this.material = material;
};

Node.property.setTexture = function(texture){
    this.texture = texture;
};

Node.property.setMatrix = function(m){
    this.m = mat4.clone(m);
};
