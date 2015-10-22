function LinearAnimation(scene, duration, controlPoints) {
    Animation.call(this, scene, duration);

    this.controlPoints = controlPoints;

    var distance = 0;

    var vectors = [];

    for(var i = 0; i < this.controlPoints.length - 1; i++){
        var x = this.controlPoints[i].x - this.controlPoints[i + 1].x;
        var y = this.controlPoints[i].y - this.controlPoints[i + 1].y;
        var z = this.controlPoints[i].z - this.controlPoints[i + 1].z;

        var l =  Math.sqrt(x*x + y*y + z*z);

        vectors.push({'x': x, 'y': y, 'z': z, 'l': l});

        distance += l;
    }

    this.velocity = distance / this.duration;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.init = function () {


};