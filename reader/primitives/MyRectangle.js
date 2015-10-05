function MyRectangle(scene, topX, topY, botX, botY, minS, maxS, minT, maxT) {
    CGFobject.call(this,scene);

    if(topX === undefined)
        this.topX = -0.5;
    else
        this.topX = topX;

    if(topY === undefined)
        this.topY = -0.5;
    else
        this.topY = topY;

    if(botX === undefined)
        this.botX = 0.5;
    else
        this.botX = botX;

    if(botY === undefined)
        this.botY = 0.5;
    else
        this.botY = botY;

    if(minS === undefined)
        this.minS = 0;
    else
        this.minS = minS;

    if(maxS === undefined)
        this.maxS = 1;
    else
        this.maxS = maxS;

    if(minT === undefined)
        this.minT = 0;
    else
        this.minT = minT;

    if(maxT === undefined)
        this.maxT = 1;
    else
        this.maxT = maxT;

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function () {
    this.vertices = [
        this.topX, this.topY, 0,
        this.botX, this.topY, 0,
        this.topX, this.botY, 0,
        this.botX, this.botY, 0
    ];

    this.indices = [
        2, 1, 0,
        1, 2, 3
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.texCoords = [
        this.minS, this.minT,
        this.maxS, this.minT,
        this.minS, this.maxT,
        this.maxS, this.maxT
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
};
