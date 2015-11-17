function Terrain(scene, texture, heightMap) {
    CGFobject.call(this, scene);

    this.material = new CGFappearance(scene);
    this.texture = new CGFtexture(scene, texture);
    this.heightmap = new CGFtexture(scene, heightMap);
    this.material.setTexture(this.texture);

    this.shader = new CGFshader(scene.gl, "shaders/normal.vert", "shaders/normal.frag");
    this.shader.setUniformsValues({scale: 0.5});
    this.shader.setUniformsValues({uSampler2: 1});

    this.plane = new Plane(scene, 60);
}

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.updateTexCoords = function(){};

Terrain.prototype.display = function() {
    this.material.apply();
    this.scene.setActiveShader(this.shader);

    this.scene.pushMatrix();
        this.heightmap.bind(1);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();
};