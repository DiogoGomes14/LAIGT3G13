function Animation(scene, duration) {
    this.active = true;
    this.scene = scene;
    this.duration = duration;
    this.time = 0;
    this.matrix = mat4.create();
}

Animation.prototype.init = function () {

};

Animation.prototype.update = function (angleRot, vecPosition) {

    if (this.time >= this.duration) {
        this.active = false;
        return false;
    }

    mat4.identity(this.matrix);

    mat4.translate(
        this.matrix,
        this.matrix,
        vecPosition
    );

    mat4.rotate(
        this.matrix,
        this.matrix,
        angleRot,
        [0, 1, 0]
    );

    this.time += this.scene.updatePeriod / 1000;
    return true;
};

Animation.prototype.reset = function () {
    this.time = 0;
};
