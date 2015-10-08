function MyCylinder(scene, heigth, botRadius, topRadius, heightSections, ringsPerSection) {
    CGFobject.call(this, scene);

    this.height = heigth;
    this.botRadius = botRadius;
    this.topRadius = topRadius;
    this.sections = heightSections;
    this.rings = ringsPerSection;

    this.initBuffers();
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function () {
    var stacksWidth = 1/this.rings,
        heightDifference = this.topRadius - this.botRadius,
        varRadius = heightDifference/this.sections, //variation of the radius per section
        lowerHeight = this.botRadius > this.topRadius ? this.topRadius : this.botRadius,
        angle = (2 * Math.PI) / this.sections,
        sectionRadius;

    this.vertices = [];
    for (var i = 0; i < this.sections; i++) {
        for (var j = 0; j < this.rings + 1; j++) {

            sectionRadius = this.topRadius - varRadius * j;

            //i == 0 ? console.log(sectionRadius) : "";

            this.vertices.push(
                sectionRadius * Math.cos(angle * i),
                sectionRadius * Math.sin(angle * i),
                j * stacksWidth - 0.5
            );
        }
    }

    var nVertices = this.vertices.length / 3;

    var k = 0;
    this.indices = [];
    for (i = 0; i < 2*this.sections; i++, i++) {
        for (j = 0; j < this.rings; j++) {
            var val = i + j + k;
            this.indices.push(
                (val + this.rings + 1) % (nVertices),
                (val + 1) % (nVertices),
                val % (nVertices)
            );
            this.indices.push(
                (val + 1) % (nVertices),
                (val + this.rings + 1) % (nVertices),
                (val + this.rings + 2) % (nVertices)
            );
        }
        k += this.rings - 1;
    }

    this.normals = [];
    for (i = 0; i < this.sections; i++) {
        for (k = 0; k < this.rings + 1; k++){
            sectionRadius = this.topRadius - varRadius * j;
            this.normals.push(
                sectionRadius * Math.cos(angle * i),
                sectionRadius * Math.sin(angle * i),
                0
            );
        }
    }

    //TODO this is wrong. Fix it
    this.texCoords = [];
    for (i = 0; i <= this.sections; i++){
        for (k = 0; k <= this.rings; k++){
            this.texCoords.push(
                (i % (this.sections + 1) ) / this.sections,
                k / this.rings
            );
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
