MySceneGraph.prototype.parseLSXMaterials = function(rootElement) {
    var elems = rootElement.getElementsByTagName('MATERIALS');
    if(elems === null) {
        return "MATERIALS element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'MATERIALS' element found.";
    }

    this.scene.lsxMaterials = [];
    // iterate over every element
    var nMaterials = elems[0].children.length;
    for (var i=0; i < nMaterials; i++)
    {
        var e = elems[0].children[i];

        this.scene.lsxMaterials[e.id] = this.parseLSXMaterial(e);
    }
};

MySceneGraph.prototype.parseLSXMaterial = function(element) {
    var parsedMaterial = [];

    parsedMaterial['shininess'] = this.reader.getFloat(element.children[0], 'value', true);
    parsedMaterial['specular'] = this.parseColour(element.children[1]);
    parsedMaterial['diffuse'] = this.parseColour(element.children[2]);
    parsedMaterial['ambient'] = this.parseColour(element.children[3]);
    parsedMaterial['emission'] = this.parseColour(element.children[4]);

    var material = new CGFappearance(this.scene);
    material.setAmbient(
        parsedMaterial['ambient'].r,
        parsedMaterial['ambient'].g,
        parsedMaterial['ambient'].b,
        parsedMaterial['ambient'].a
    );
    material.setDiffuse(
        parsedMaterial['diffuse'].r,
        parsedMaterial['diffuse'].g,
        parsedMaterial['diffuse'].b,
        parsedMaterial['diffuse'].a
    );
    material.setSpecular(
        parsedMaterial['specular'].r,
        parsedMaterial['specular'].g,
        parsedMaterial['specular'].b,
        parsedMaterial['specular'].a
    );
    material.setEmission(
        parsedMaterial['emission'].r,
        parsedMaterial['emission'].g,
        parsedMaterial['emission'].b,
        parsedMaterial['emission'].a
    );
    material.setShininess(
        parsedMaterial['shininess']
    );

    return material;
};