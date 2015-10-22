function MyInterface() {
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.group=this.gui.addFolder("Lights");
    this.group.open();

    return true;
};

MyInterface.prototype.processKeyboard = function(event) {
    CGFinterface.prototype.processKeyboard.call(this,event);
};

MyInterface.prototype.addLightsSwitch = function(name) {
    this.group.add(this.scene, name);
};