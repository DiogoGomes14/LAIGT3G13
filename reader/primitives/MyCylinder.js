function MyCylinder(scene, heigth, botRadius, topRadius, rings, parts) {
    CGFobject.call(this, scene);


    this.height = heigth;
    this.rings = rings;
    this.parts = parts;
    this.botRadius = botRadius;
    this.topRadius = topRadius;

    this.initBuffers();
}

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function () {
    var ringWidth = 1/this.rings,
        deltaRadius = (this.botRadius - this.topRadius) / this.rings,
        angle = (2 * Math.PI) / this.parts;

    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];

    for (var part = 0; part < this.parts + 1; part++) {
        for (var ring = 0; ring < this.rings + 1; ring++) {
            var radius = this.botRadius - deltaRadius * ring;

            this.vertices.push(
                radius * Math.cos(angle * part),
                radius * Math.sin(angle * part),
                (ring * ringWidth) * this.height
            );

            this.normals.push(
                radius * Math.cos(angle * part),
                radius * Math.sin(angle * part),
                0
            );

            this.texCoords.push(
                1 - part / this.parts,
                ring / this.rings
            );
        }
    }

    for (part = 0; part < this.parts; part++) {
        for(ring = 0; ring < this.rings; ring++){
            var partN = (this.rings + 1) * part;
            this.indices.push(
                ring + partN,
                ring + partN + this.rings + 1,
                ring + partN + 1
            );
            this.indices.push(
                ring + partN + 1 ,
                ring + partN + this.rings + 1,
                ring + partN + this.rings + 2
            );
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
/*
MyCylinder.prototype.display1 = function(matrix, material, texture){

    if(texture !== null){
        texture = texture.texture;
    }

    this.scene.pushMatrix();
        this.scene.multMatrix(this.scene.initialMatrix);
        this.scene.multMatrix(matrix);
        material.setTexture(texture);
        material.apply();
        this.scene.display();
    this.scene.popMatrix();

    material.setTexture(null);
};*/