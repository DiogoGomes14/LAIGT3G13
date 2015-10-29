function LinearAnimation(scene, duration, controlPoints) {
    Animation.call(this, scene, duration);

    this.controlPoints = controlPoints;

    this.distance = 0;

    this.vectors = [];

    for(var i = 0; i < this.controlPoints.length - 1; i++){
        var x = this.controlPoints[i].x - this.controlPoints[i + 1].x;
        var y = this.controlPoints[i].y - this.controlPoints[i + 1].y;
        var z = this.controlPoints[i].z - this.controlPoints[i + 1].z;

        var vecLength =  Math.sqrt(x*x + y*y + z*z);

        this.vectors.push({'x': x, 'y': y, 'z': z, 'l': vecLength});

        this.distance += vecLength;
    }

    //this.velocity = this.distance / this.duration;

    this.time = 0;
    this.vecAnimating = 0;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.init = function () {


};

LinearAnimation.prototype.calculateMatrix = function () { //time is in ms Maybe

    if(this.time >= this.duration){
        this.vecAnimating = 0;
        this.time = 0;
        return false;
    }

    if(this.time >= this.duration * this.vectors[this.vecAnimating].l / this.distance){
        this.vecAnimating++;
    }

    var matrix = mat4.create();
    mat4.identity(matrix);

    mat4.rotate(
        matrix,
        matrix,
        Math.acos(this.vectors[this.vecAnimating].x / this.distance),
        [0, 1, 0]
    );
    mat4.translate(
        matrix,
        matrix,
        [
            this.vectors[this.vecAnimating].x / this.time,
            this.vectors[this.vecAnimating].y / this.time,
            this.vectors[this.vecAnimating].z / this.time
        ]
    );

    this.time++;

    return matrix;
};