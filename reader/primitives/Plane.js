function Plane(scene, parts) {
    Patch.call(
        this,
        scene,
        parts,
        parts
    );
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.display = function () {
    Patch.prototype.display.call();
};
