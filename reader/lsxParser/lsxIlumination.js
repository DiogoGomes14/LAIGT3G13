//TODO apply doubleside
MySceneGraph.prototype.parseLSXIlumination= function(rootElement) {

    var elems = rootElement.getElementsByTagName('ILUMINATION');
    if (elems == null) {
        return "ILUMINATION element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'ILUMINATION' element found.";
    }

    this.ilumination = [];
    this.ilumination['ambient'] = this.parseColour(elems[0].children[0]);
    this.ilumination['doubleside'] = this.reader.getBoolean(elems[0].children[1], 'value', true );
    this.ilumination['background'] = this.parseColour(elems[0].children[2]);

    /*
     this.ilumination = [];
     this.ilumination.push(this.parseColour(elems[0].children[0]));
     this.ilumination.push(this.reader.getBoolean(elems[0].children[1], 'value', true ));
     this.ilumination.push(this.parseColour(elems[0].children[2]));
     */
};