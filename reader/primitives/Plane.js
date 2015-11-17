function Plane(scene, parts) {
    this.scene = scene;
    this.plane = new Patch(scene, parts, parts);
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.updateTexCoords = function(){};

Plane.prototype.display = function () {
    this.plane.display();
};
