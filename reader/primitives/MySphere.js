function MySphere(scene, radius, rings, sections) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.rings = sections;
    this.parts = rings;

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


    var alpha = (2 * Math.PI) / this.rings,
        beta = (2 * Math.PI) / this.parts;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];


    for (var ring = 0; ring < this.rings + 1; ring++) {
        for (var part = 0; part < this.parts + 1; part++) {
            /*console.log(
                ring + ": \n" +
                "x = " + (this.radius * Math.cos(alpha * ring) * Math.sin(beta * part)).toFixed(2),
                "y = " + (this.radius * Math.sin(alpha * ring) * Math.sin(beta * part)).toFixed(2),
                "z = " + (this.radius * Math.cos(beta * part)).toFixed(2)
            );*/

            this.vertices.push(
                this.radius * Math.cos(alpha * ring) * Math.sin(beta * part),
                this.radius * Math.sin(alpha * ring) * Math.sin(beta * part),
                this.radius * Math.cos(beta * part)
            );

            // TODO fix
            this.texCoords.push(
                0.5 - 0.5 * Math.cos(alpha * ring) * Math.sin(beta * part),
                0.5 - 0.5 * Math.sin(alpha * ring) * Math.sin(beta * part)
            );
        }
    }

    this.normals = this.vertices.slice(0);

    var nVertices = this.vertices.length / 3;
    for (ring = 0; ring < this.rings; ring++) {
        for (part = 0; part < this.parts; part++) {
            var partN = (this.rings + 1) * part;
            this.indices.push(
                ring + partN,
                ring + partN + 1,
                ring + partN + this.parts + 2
            );
            this.indices.push(
                (ring + partN + this.parts + 3) % nVertices,
                (ring + partN + this.parts + 2) % nVertices,
                (ring + partN + 1) % nVertices
            );
        }
    }

    //console.dir(this.vertices);

/*
    var nVertices = this.vertices.length / 3;
    for (i = 0; i < nVertices/2; i++) {
        this.indices.push(
            i % nVertices,
            (i + 1) % nVertices,
            (i + this.parts + 2) % nVertices
        );
        this.indices.push(
            (i + this.parts + 3) % nVertices,
            (i + this.parts + 2) % nVertices,
            (i + 1) % nVertices
        );
    }

    for (i = 0; i <= this.rings; i++) {
        for (j = 0; j <= this.parts; j++) {
            this.texCoords.push(
                0.5 - 0.5 * Math.cos(alpha * i) * Math.sin(beta * j),
                0.5 - 0.5 * Math.sin(alpha * i) * Math.sin(beta * j)
            );
        }
    }
*/

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MySphere.prototype.pushIndices = function(r, s){
    var curRow = r * this.rings;
    var nextRow = (r+1) * this.rings;

    this.indices.push(curRow + s);
    this.indices.push(nextRow + s);
    this.indices.push(nextRow + (s+1));

    this.indices.push(curRow + s);
    this.indices.push(nextRow + (s+1));
    this.indices.push(curRow + (s+1));
};
