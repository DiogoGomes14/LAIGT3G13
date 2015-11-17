function MyRectangle(scene, v1, v2) {
    CGFobject.call(this,scene);

    this.v1 = v1;
    this.v2 = v2;

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function () {
    this.vertices = [
        this.v1[0], this.v2[1], 0.0,
        this.v2[0], this.v2[1], 0.0,
        this.v1[0], this.v1[1], 0.0,
        this.v2[0], this.v1[1], 0.0
    ];

    this.normals = [
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0
    ];

    this.updateTexCoords(1.0,1.0);

    this.indices = [
        0, 1, 2, 3
    ];

    this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
    this.initGLBuffers();
};

MyRectangle.prototype.updateTexCoords = function(amplifS, amplifT){
    var width = this.v2[0] - this.v1[0];
    var height= this.v1[1] - this.v2[1];

    this.texCoords = [
        0.0, 1.0 * height / amplifT,
        1.0 * width / amplifS, 1.0 * height / amplifT,
        0.0, 0.0,
        1.0 * width / amplifS, 0.0
    ];
};