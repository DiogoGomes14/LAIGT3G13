function CircularAnimation(scene, duration, radius, center, initialAngle, rotationAngle) {
    Animation.call(this, scene, duration);

    this.radius = radius;
    this.center = center;
    this.initialAngle = initialAngle;
    this.rotationAngle = rotationAngle;

    this.angleVariation = this.rotationAngle / this.duration;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function () {


};

CircularAnimation.prototype.update = function () {

    if (this.time >= this.duration) {
        this.active = false;
        return;
    }

    var angle = this.initialAngle + this.angleVariation * this.time;
    Animation.prototype.update.call(
        this,
        angle,
        [
            this.center[0] + this.radius * Math.cos(angle),
            this.center[1],
            this.center[2] + this.radius * Math.sin(angle)
        ]
    );

};

CircularAnimation.prototype.reset = function () {
    Animation.prototype.reset.call(this);
};
