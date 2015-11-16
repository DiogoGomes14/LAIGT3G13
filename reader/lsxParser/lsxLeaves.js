MySceneGraph.prototype.parseLSXLeaves = function (rootElement) {
    var elems = rootElement.getElementsByTagName('LEAVES');
    if (elems === null) {
        return "LEAVES element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'LEAVES' element found.";
    }

    this.scene.lsxLeaves = [];
    // iterate over every element
    var nLeaves = elems[0].children.length;
    for (var i = 0; i < nLeaves; i++) {
        var e = elems[0].children[i];
        if (this.scene.lsxLeaves[e] !== undefined) {
            console.error("Leaf " + e + " already exists");
        }
        this.scene.lsxLeaves[e.id] = this.parseLSXLeaf(e);
    }
};

MySceneGraph.prototype.parseLSXLeaf = function (element) {
    var leaf = [];
    var tempArgs;

    leaf['type'] = this.reader.getString(element, 'type', true);

    if (leaf['type'] == "plane") {

        leaf['parts'] = this.reader.getInteger(element, 'parts', true);

    } else if (leaf['type'] == "patch") {

        leaf['order'] = this.reader.getInteger(element, 'order', true);
        leaf['partsU'] = this.reader.getInteger(element, 'partsU', true);
        leaf['partsV'] = this.reader.getInteger(element, 'partsV', true);
        leaf['controlPoints'] = this.parseControlPoints(element);

    } else if (leaf['type'] == "vehicle") {

    } else if (leaf['type'] == "terrain") {

        leaf['texture'] = this.reader.getString(element, 'texture', true);
        leaf['heightmap'] = this.reader.getString(element, 'heightmap', true);

    } else {

        tempArgs = this.reader.getString(element, 'args', true);
        leaf['args'] = tempArgs.split(/\s+/);
        for (var i = 0; i < leaf['args'].length; i++) {
            leaf['args'][i] = parseFloat(leaf['args'][i]);
        }

    }


    return leaf;
};