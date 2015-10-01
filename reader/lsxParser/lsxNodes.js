MySceneGraph.prototype.parseLSXNodes= function(rootElement) {

    var elems = rootElement.getElementsByTagName('NODES');
    if (elems == null) {
        return "NODES element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'NODES' element found.";
    }

    var nodeList = [];

    nodeList['root'] = elems[0].children[0].id; //TODO root
    // iterate over every element
    //console.log(elems[0].getElementsByTagName('NODE'));
    var nModes = elems[0].children.length;
    for (var i = 1; i < nModes; i++)
    {
        var e = elems[0].children[i];

        nodeList[e.id] = this.parseLSXNode(e);
    }

    console.log(nodeList)
};

MySceneGraph.prototype.parseLSXNode = function(element) {
    var node = [];

    node['material'] = this.reader.getString(element.children[0], 'id', true);
    node['texture'] = this.reader.getString(element.children[1], 'id', true);
    var transformations = [];
    var i = 2;
    while(1){
        if(element.children[i].tagName === 'TRANSLATION'){
            transformations.push(this.parseTranslate(element.children[i]));
        } else if(element.children[i].tagName === 'ROTATION'){
            transformations.push(this.parseRotation(element.children[i]));
        } else if(element.children[i].tagName === 'SCALE'){
            transformations.push(this.parseScale(element.children[i]));
        } else
            break;
        i++;
    }
    node['transformations'] = transformations;
    node['descendants'] = this.parseLSXDescendants(element.children[i]);

    return node;
};

MySceneGraph.prototype.parseLSXDescendants = function(element) {
    var descendants = [];

    var nDescendants = element.children.length;
    for (var i = 0; i < nDescendants; i++) {;
        descendants.push(this.reader.getString(element.children[i],'id', true));
    }

    return descendants;
};