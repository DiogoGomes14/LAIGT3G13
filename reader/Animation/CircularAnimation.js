function CircularAnimation(scene, duration, radius, center, initialAngle, rotationAngle) {
    Animation.call(this, scene, duration);

    this.radius = radius;
    this.center = center;
    this.initialAngle = initialAngle;
    this.rotationAngle = rotationAngle;

    this.angleVariation = this.rotationAngle/this.duration;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.init = function () {




};