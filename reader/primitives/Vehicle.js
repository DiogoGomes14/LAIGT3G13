function Vehicle(scene) {
    CGFobject.call(this, scene);

    var controlPoints = [
        {'x': -1.5, 'y': 2, 'z': 0},
        {'x': -0.5, 'y': 2, 'z': -1},
        {'x': 0.5, 'y': 2, 'z': 1},
        {'x': 1.5, 'y': 2, 'z': 0},
        {'x': -1.5, 'y': 1, 'z': 1},
        {'x': -0.5, 'y': 1, 'z': 0},
        {'x': 0.5, 'y': 1, 'z': 2},
        {'x': 1.5, 'y': 1, 'z': 1},
        {'x': -1.5, 'y': 0, 'z': 0},
        {'x': -0.5, 'y': 0, 'z': -1},
        {'x': 0.5, 'y': 0, 'z': 1},
        {'x': 1.5, 'y': 0, 'z': 0}
    ];

    //temporary
    //this.vehicle = new Patch(scene, 40, 40, 2, 3, controlPoints);
    this.cone = new MyCylinder(scene, 0.3, 0.15, 0, 4, 30);
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.updateTexCoords = function () {
};

Vehicle.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(4,4,4);
    //this.vehicle.display();
    this.cone.display();
    this.scene.popMatrix();
};