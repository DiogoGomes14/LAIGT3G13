MySceneGraph.prototype.parseLSXIlumination= function(rootElement) {

    var elems = rootElement.getElementsByTagName('ILUMINATION');
    if (elems == null) {
        return "ILUMINATION element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'ILUMINATION' element found.";
    }

    this.scene.lsxIlumination = [];
    this.scene.lsxIlumination['ambient'] = this.parseColour(elems[0].children[0]);
    this.scene.lsxIlumination['background'] = this.parseColour(elems[0].children[1]);

    /*
     this.lsxIlumination = [];
     this.lsxIlumination.push(this.parseColour(elems[0].children[0]));
     this.lsxIlumination.push(this.reader.getBoolean(elems[0].children[1], 'value', true ));
     this.lsxIlumination.push(this.parseColour(elems[0].children[2]));
     */
};