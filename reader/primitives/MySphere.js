function MySphere(scene, radius, rings, sections) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.sections = sections;
    this.rings = rings;

    this.initBuffers();
}

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function () {
    /*this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    var R = 1/(this.rings - 1);
    var S = 1/(this.sections - 1);

    for(var r = 0; r < this.rings; r++) {
        for(var s = 0; s < this.sections; s++) {
            var y = Math.sin(-Math.PI/2 + Math.PI * r * R );
            var x = Math.cos(2*Math.PI * s * S) * Math.sin( Math.PI * r * R );
            var z = Math.sin(2*Math.PI * s * S) * Math.sin( Math.PI * r * R );

            this.vertices.push(x * this.radius, y * this.radius, z * this.radius);
            this.pushIndices(r, s);
            this.normals.push(x, y, z);
            this.texCoords.push(s * S, r * R);
        }
    }*/


    var alpha = (2 * Math.PI) / this.sections,
        beta = (2 * Math.PI) / this.rings;

    this.vertices = [];
    for (var i = 0; i < this.sections; i++) {
        for (var j = 0; j < this.rings + 1; j++) {
            this.vertices.push(
                this.radius * Math.cos(alpha * i) * Math.sin(beta * j),
                this.radius * Math.sin(alpha * i) * Math.sin(beta * j),
                this.radius * Math.cos(beta * j)
            );
        }
    }

    var nVertices = this.vertices.length / 3;

    this.indices = [];
    for (i = 0; i < nVertices/2; i++) {
        this.indices.push(
            i % nVertices,
            (i + 1) % nVertices,
            (i + this.rings + 2) % nVertices
        );
        this.indices.push(
            (i + this.rings + 3) % nVertices,
            (i + this.rings + 2) % nVertices,
            (i + 1) % nVertices
        );

    }

    this.normals = [];
    this.normals = this.vertices.slice(0);

    this.texCoords = [];
    for (i = 0; i <= this.sections; i++) {
        for (j = 0; j <= this.rings; j++) {
            this.texCoords.push(
                0.5 - 0.5 * Math.cos(alpha * i) * Math.sin(beta * j),
                0.5 - 0.5 * Math.sin(alpha * i) * Math.sin(beta * j)
            );
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MySphere.prototype.pushIndices = function(r, s){
    var curRow = r * this.sections;
    var nextRow = (r+1) * this.sections;

    this.indices.push(curRow + s);
    this.indices.push(nextRow + s);
    this.indices.push(nextRow + (s+1));

    this.indices.push(curRow + s);
    this.indices.push(nextRow + (s+1));
    this.indices.push(curRow + (s+1));
};
