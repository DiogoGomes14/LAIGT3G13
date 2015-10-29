function MyInterface() {
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.lights=this.gui.addFolder("Lights");
    this.lights.open();

    return true;
};

MyInterface.prototype.processKeyboard = function(event) {
    CGFinterface.prototype.processKeyboard.call(this,event);
};

MyInterface.prototype.addLightsSwitch = function(name) {
    this.lights.add(this.scene, name);
};