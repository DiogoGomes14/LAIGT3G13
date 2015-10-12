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
    var alpha = (2 * Math.PI) / this.rings,
        beta = (2 * Math.PI) / this.parts;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];


    for (var part = 0; part < this.parts + 1; part++) {
        for (var ring = 0; ring < this.rings + 1; ring++) {
            this.vertices.push(
                this.radius * Math.cos(alpha * part) * Math.sin(beta * ring),
                this.radius * Math.sin(alpha * part) * Math.sin(beta * ring),
                this.radius * Math.cos(beta * ring)
            );

            this.texCoords.push(
                part / this.rings,
                2 * ring / this.parts
            );
        }
    }

    this.normals = this.vertices.slice(0);

    var nVertices = this.vertices.length / 3;
    for (part = 0; part < this.rings; part++) {
        for (ring = 0; ring < this.parts; ring++) {
            var partN = (this.rings + 1) * part;
            this.indices.push(
                ring + partN,
                ring + partN + 1,
                ring + partN + this.rings + 2
            );
            this.indices.push(
                (ring + partN + this.rings + 3) % nVertices,
                (ring + partN + this.rings + 2) % nVertices,
                (ring + partN + 1) % nVertices
            );
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};