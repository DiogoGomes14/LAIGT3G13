MySceneGraph.prototype.parseLSXLeaves = function(rootElement) {
    var elems = rootElement.getElementsByTagName('LEAVES');
    if(elems === null) {
        return "LEAVES element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'LEAVES' element found.";
    }

    this.leaves = [];
    // iterate over every element
    var nLeaves = elems[0].children.length;
    for (var i=0; i < nLeaves; i++)
    {
        var e = elems[0].children[i];

        this.leaves[e.id] = this.parseLSXLeaf(e);
    }
};

MySceneGraph.prototype.parseLSXLeaf = function(element) {
    var leaf = [];

    leaf['type'] = this.reader.getString(element, 'type', true);
    leaf['args'] = this.reader.getString(element, 'args', true);

    return leaf;
};