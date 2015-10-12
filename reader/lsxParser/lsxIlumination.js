MySceneGraph.prototype.parseLSXIllumination= function(rootElement) {

    var elems = rootElement.getElementsByTagName('ILLUMINATION');
    if (elems == null) {
        return "ILLUMINATION element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'ILLUMINATION' element found.";
    }

    this.scene.lsxIllumination = [];
    this.scene.lsxIllumination['ambient'] = this.parseColour(elems[0].children[0]);
    this.scene.lsxIllumination['background'] = this.parseColour(elems[0].children[1]);
};