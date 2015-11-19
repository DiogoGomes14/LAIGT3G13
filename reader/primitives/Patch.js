function Patch(scene, partsU, partsV, degreeU, degreeV, controlPoints) {
    CGFobject.call(this, scene);

    this.partsU = (partsU == undefined ? 1 : partsU);
    this.partsV = (partsV == undefined ? 1 : partsV);

    this.degreeU = (degreeU == undefined ? 1 : degreeU);
    this.degreeV = (degreeV == undefined ? 1 : degreeV);

    this.knotsU = [];
    for (var i = 0; i < (this.degreeU + 1) * 2; i++) {
        if (i < this.degreeU + 1)
            this.knotsU.push(0);
        else
            this.knotsU.push(1);
    }

    this.knotsV = [];
    for (var i = 0; i < (this.degreeV + 1) * 2; i++) {
        if (i < this.degreeV + 1)
            this.knotsV.push(0);
        else
            this.knotsV.push(1);
    }

    this.controlPoints = [];
    if (controlPoints == undefined) {
        this.controlPoints = [[[-0.5, 0.0, 0.5, 1], [-0.5, 0.0, -0.5, 1]], [[0.5, 0.0, 0.5, 1], [0.5, 0.0, -0.5, 1]]];
    } else {
        for (i = 0; i < this.degreeU + 1; i++) {
            var v = [];
            for (var j = 0; j < this.degreeV + 1; j++) {
                v.push([controlPoints[i * (this.degreeV + 1) + j].x, controlPoints[i * (this.degreeV + 1) + j].y, controlPoints[i * (this.degreeV + 1) + j].z, 1]);
            }
            this.controlPoints.push(v);
        }
    }

    var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.knotsU, this.knotsV, this.controlPoints);

    var getSurfacePoint = function (u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);

}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.updateTexCoords = function(){};

Patch.prototype.display = function () {
    this.surface.display();
};
