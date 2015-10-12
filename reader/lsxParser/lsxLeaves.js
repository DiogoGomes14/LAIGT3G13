MySceneGraph.prototype.parseLSXLeaves = function(rootElement) {
    var elems = rootElement.getElementsByTagName('LEAVES');
    if(elems === null) {
        return "LEAVES element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'LEAVES' element found.";
    }

    this.scene.lsxLeaves = [];
    // iterate over every element
    var nLeaves = elems[0].children.length;
    for (var i=0; i < nLeaves; i++)
    {
        var e = elems[0].children[i];

        this.scene.lsxLeaves[e.id] = this.parseLSXLeaf(e);
    }
};

MySceneGraph.prototype.parseLSXLeaf = function(element) {
    var leaf = [];
    var tempArgs;

    leaf['type'] = this.reader.getString(element, 'type', true);
    tempArgs = this.reader.getString(element, 'args', true);
    leaf['args'] = tempArgs.split(/\s+/);
    for(var i = 0; i < leaf['args'].length; i++){
        leaf['args'][i] = parseFloat(leaf['args'][i]);
    }

    return leaf;
};