MySceneGraph.prototype.parseLSXMaterials = function(rootElement) {
    var elems = rootElement.getElementsByTagName('MATERIALS');
    if(elems === null) {
        return "MATERIALS element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'MATERIALS' element found.";
    }

    this.materials = [];
    // iterate over every element
    var nMaterials = elems[0].children.length;
    for (var i=0; i < nMaterials; i++)
    {
        var e = elems[0].children[i];

        this.materials[e.id] = this.parseLSXMaterial(e);
    }
};

MySceneGraph.prototype.parseLSXMaterial = function(element) {
    var texture = [];

    texture['shininess'] = this.reader.getFloat(element.children[0], 'value', true);
    texture['specular'] = this.parseColour(element.children[1]);
    texture['diffuse'] = this.parseColour(element.children[2]);
    texture['ambient'] = this.parseColour(element.children[3]);
    texture['emission'] = this.parseColour(element.children[4]);

    return texture;
};