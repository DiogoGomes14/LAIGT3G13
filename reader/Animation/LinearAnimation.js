function LinearAnimation(scene, duration, controlPoints) {
    Animation.call(this, scene, duration);

    this.controlPoints = controlPoints;

    this.distance = 0;
    this.nVector = 0;
    this.timeSector = 0;
    this.startingPoint = {'x': 0, 'y': 0, 'z': 0};
    this.vectors = [];

    for (var i = 0; i < this.controlPoints.length - 1; i++) {
        var x = this.controlPoints[i + 1].x - this.controlPoints[i].x;
        var y = this.controlPoints[i + 1].y - this.controlPoints[i].y;
        var z = this.controlPoints[i + 1].z - this.controlPoints[i].z;

        var vecLength = Math.sqrt(x * x + y * y + z * z);
        var vecLengthXZ = Math.sqrt(x * x + z * z);

        this.vectors.push({'x': x, 'y': y, 'z': z, 'l': vecLength,'lxz': vecLengthXZ, 't': 0});

        this.distance += vecLength;
    }

    this.velocity = this.distance / this.duration;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function () {

    //update the time that this vector has used
    this.timeSector += this.scene.updatePeriod / 1000;

    var vector = this.vectors[this.nVector],
        angle = Math.acos(vector.x / (vector.lxz == 0 ? 1 : vector.lxz)), //TODO change. There is a bug here when the vector is different than 0 only on the y axis
        x = this.startingPoint.x + vector.x * this.velocity * this.timeSector / vector.l,
        y = this.startingPoint.y + vector.y * this.velocity * this.timeSector / vector.l,
        z = this.startingPoint.z + vector.z * this.velocity * this.timeSector / vector.l;

    if(!Animation.prototype.update.call(this, angle, [x, y, z])){
        return;
    }

    //Next vector
    if (this.timeSector >= this.duration * vector.l / this.distance) {
        this.startingPoint.x += vector.x;
        this.startingPoint.y += vector.y;
        this.startingPoint.z += vector.z;
        this.nVector++;
        this.timeSector = 0;
    }

    //console.log(this.timeSector);
    //console.log(this.time + " : " + this.duration * this.vecAnimating.l / this.distance);
    //console.log("VECTOR: x = " + this.startingPoint.x + "| y = " + this.startingPoint.y + "| z = " + this.startingPoint.z);
    //console.log("Angle: " + Math.round(angle * 180 / Math.PI) + "; vector: x=" + x + " y=" + y + " z=" + z);

};

LinearAnimation.prototype.reset = function () {
    Animation.prototype.reset.call(this);
};