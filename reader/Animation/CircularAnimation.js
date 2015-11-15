function CircularAnimation(scene, duration, radius, center, initialAngle, rotationAngle) {
    Animation.call(this, scene, duration, "Circular");

    this.radius = radius;
    this.center = {
        'x': center[0],
        'y': center[1],
        'z': center[2]
    };
    this.initialAngle = initialAngle;
    this.rotationAngle = rotationAngle;

    this.angleVariation = this.rotationAngle / this.duration;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function () {


};

CircularAnimation.prototype.update = function (time) {

    var angle = Math.PI * (this.initialAngle + this.angleVariation * time) / 180;

    return Animation.prototype.update.call(
        this,
        -angle + Math.PI/2,
        [
            this.center.x + this.radius * Math.cos(angle),
            this.center.y,
            this.center.z + this.radius * Math.sin(angle)
        ],
        time
    );

};