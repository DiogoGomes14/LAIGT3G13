function MyTriangle(scene, v1, v2, v3) {
    CGFobject.call(this,scene);

    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    console.log(v1, v2, v3);

    this.a = Math.sqrt((v1[0] - v3[0]) * (v1[0] - v3[0]) +
        (v1[1] - v3[1]) * (v1[1] - v3[1]) +
        (v1[2] - v3[2]) * (v1[2] - v3[2]));

    this.b = Math.sqrt((v2[0] - v1[0]) * (v2[0] - v1[0]) +
        (v2[1] - v1[1]) * (v2[1] - v1[1]) +
        (v2[2] - v1[2]) * (v2[2] - v1[2]));

    this.c = Math.sqrt((v3[0] - v2[0]) * (v3[0] - v2[0]) +
        (v3[1] - v2[1]) * (v3[1] - v2[1]) +
        (v3[2] - v2[2]) * (v3[2] - v2[2]));

    this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
    this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
    this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);

    this.beta = Math.acos(this.cosBeta);
    this.alpha = Math.acos(this.cosAlpha);
    this.gamma = Math.acos(this.cosGamma);
    //console.log(this.beta, this.alpha, this.gamma);
    this.sum = this.beta + this.alpha + this.gamma;
    console.log(this.sum, Math.PI);

    this.initBuffers();
}

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyRectangle;

MyTriangle.prototype.initBuffers = function () {
    this.vertices = [
        // Front face
        this.v1[0],this.v1[1],this.v1[2],
        this.v2[0],this.v2[1],this.v2[2],
        this.v3[0],this.v3[1],this.v3[2]

    ];

    this.normals = [
        // Front face
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0
    ];

    this.updateTexCoords(1,1);

    this.indices = [
        0, 1, 2
    ];

    this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
    this.initGLBuffers();

};


MyTriangle.prototype.updateTexCoords = function(amplifS, amplifT){
    this.texCoords = [
        (this.c - this.a * Math.cos(this.beta)) / amplifS, 0.0,
        0.0, 1 / amplifT,
        this.c / amplifS, 1.0 / amplifT
    ];
};