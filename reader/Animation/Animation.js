function Animation(scene, duration, type) {
    this.active = true;
    this.scene = scene;
    this.duration = duration;
    this.type = type;
}

Animation.prototype.update = function (angleRot, vecPosition) {

    var matrix = mat4.create();
    mat4.identity(matrix);

    mat4.translate(
        matrix,
        matrix,
        vecPosition
    );

    mat4.rotate(
        matrix,
        matrix,
        angleRot,
        [0, 1, 0]
    );

    return matrix;
};
