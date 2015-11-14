function LinearAnimation(scene, duration, controlPoints) {
    Animation.call(this, scene, duration, "Linear");

    this.controlPoints = controlPoints;

    this.distance = 0;
    this.vectors = [];

    for (var i = 0; i < this.controlPoints.length - 1; i++) {
        var x = this.controlPoints[i + 1].x - this.controlPoints[i].x;
        var y = this.controlPoints[i + 1].y - this.controlPoints[i].y;
        var z = this.controlPoints[i + 1].z - this.controlPoints[i].z;

        var vecLength = Math.sqrt(x * x + y * y + z * z);
        var vecLengthXZ = Math.sqrt(x * x + z * z);

        this.vectors.push(
            {
                'x': x,
                'y': y,
                'z': z,
                'l': vecLength,
                'lxz': vecLengthXZ
            }
        );

        this.distance += vecLength;
    }

    this.velocity = this.distance / this.duration;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function (time, timeVector, nVector) {
    var vector = this.vectors[nVector],
        angle = Math.acos(vector.x / (vector.lxz == 0 ? 1 : vector.lxz)), //TODO change. There is a bug here when the vector is different than 0 only on the y axis
        x = this.controlPoints[nVector].x + vector.x * this.velocity * timeVector / vector.l,
        y = this.controlPoints[nVector].y + vector.y * this.velocity * timeVector / vector.l,
        z = this.controlPoints[nVector].z + vector.z * this.velocity * timeVector / vector.l;

    return Animation.prototype.update.call(this, angle, [x, y, z]);
};