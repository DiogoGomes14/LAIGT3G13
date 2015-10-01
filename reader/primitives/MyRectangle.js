function MyRectangle(scene, minS, maxS, minT, maxT) {
    CGFobject.call(this,scene);

    if(minS === undefined){
        this.minS = 0;
    }
    else {
        this.minS = minS;
    }

    if(maxS === undefined){
        this.maxS = 1;
    }
    else {
        this.maxS = maxS;
    }

    if(minT === undefined){
        this.minT = 0;
    }
    else {
        this.minT = minT;
    }

    if(maxT === undefined){
        this.maxT = 1;
    }
    else {
        this.maxT = maxT;
    }

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function () {
    this.vertices = [
        -0.5	, 	0.5		, 	0	,	// 0
        0.5		, 	0.5		, 	0	,	// 1
        -0.5	, 	-0.5	, 	0	,	// 2
        0.5		, 	-0.5	, 	0		// 3
    ];

    this.indices = [
        2, 1, 0,
        1, 2, 3
    ];

    this.primitiveType=this.scene.gl.TRIANGLES;

    this.normals = [
        0	, 	0	, 	1	,	// 0
        0	, 	0	, 	1	,	// 1
        0	, 	0	, 	1	,	// 2
        0	, 	0	, 	1		// 3
    ];

    this.texCoords = [
        this.minS, this.minT,
        this.maxS, this.minT,
        this.minS, this.maxT,
        this.maxS, this.maxT
    ];

    this.initGLBuffers();
};
