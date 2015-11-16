function Patch(scene, partsU, partsV, degree, controlPoints) {
    CGFobject.call(this, scene);

    this.partsU = (partsU == undefined ? 1 : partsU);
    this.partsV = (partsV == undefined ? 1 : partsV);

    this.degree = (degree == undefined ? 1 : degree);

    this.knots = [];
    for (var i = 0; i < (this.degree + 1) * 2; i++) {
        if (i < this.degree + 1)
            this.knots.push(0);
        else
            this.knots.push(1);
    }

    this.controlPoints = [];
    if (controlPoints == undefined) {
        this.controlPoints = [[[-0.5, 0.0, 0.5, 1], [-0.5, 0.0, -0.5, 1]], [[0.5, 0.0, 0.5, 1], [0.5, 0.0, -0.5, 1]]];
    } else {
        for (i = 0; i < this.degree + 1; i++) {
            var v = [];
            for (var j = 0; j < this.degree + 1; j++) {
                v.push([controlPoints[i * this.degree + j].x, controlPoints[i * this.degree + j].y, controlPoints[i * this.degree + j].z, 1]);
            }
            this.controlPoints.push(v);
        }
    }
    console.log(this.controlPoints);
    var nurbsSurface = new CGFnurbsSurface(this.degree, this.degree, this.knots, this.knots, this.controlPoints);

    var getSurfacePoint = function (u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.display = function () {
    this.scene.pushMatrix();
    this.surface.display();
    this.scene.popMatrix();
};
