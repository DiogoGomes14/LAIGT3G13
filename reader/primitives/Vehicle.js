function Vehicle(scene) {
    CGFobject.call(this, scene);

    //temporary
    this.cone = new MyCylinder(scene, 0.3, 0.15, 0, 4, 30);
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.updateTexCoords = function(){};

Vehicle.prototype.display = function() {
    this.scene.pushMatrix();
    this.cone.display();
    this.scene.popMatrix();
};