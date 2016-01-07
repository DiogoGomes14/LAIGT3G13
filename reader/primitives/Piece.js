function Piece(scene, x, z, piece) {
    CGFobject.call(this, scene);

    this.up = (piece % 2 == 1);

    this.x = z === undefined ? 0 : z - 1;
    this.z = x === undefined ? 0 : x - 1;

    this.triangle = new MyTriangle(scene, [1, 0, -Math.sqrt(3) / 2], [-1, 0, -Math.sqrt(3) / 2], [0, 0, Math.sqrt(3) / 2]);

    this.side = new MyRectangle(scene, [1, 0.5], [-1, -0.5]);

    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(0.1, 0.1, 0.1, 1);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.appearance.setShininess(120);

    switch (piece){
        case 2:
        case 3:
            this.appearance.setDiffuse(1, 0.5, 0.5, 1);
            break;
        case 4:
        case 5:
            this.appearance.setDiffuse(0.5, 1, 0.5, 1);
            break;
        case 6:
        case 7:
            this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
            //this.appearance.setDiffuse(0.5, 1, 1, 1);
            break;
        default:
            //this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
            this.appearance.setDiffuse(0.5, 1, 1, 1);
            break;
    }

}

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.updateTexCoords = function () {
};

Piece.prototype.display = function () {
    this.appearance.apply();
    this.scene.scale(1, 0.1, 1);

    this.scene.translate(1.2 * this.x, 0, 1.1 * Math.sqrt(3) * this.z);

    if (!this.up)
        this.scene.rotate(Math.PI, 0, 1, 0);

    this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(0, 0.5, 0);
        this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, -Math.sqrt(3) / 2);
        this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(5 * Math.PI / 3, 0, 1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.side.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(4 * Math.PI / 3, 0, 1, 0);
        this.side.display();
    this.scene.popMatrix();
};