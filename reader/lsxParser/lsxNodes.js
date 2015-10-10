MySceneGraph.prototype.parseLSXNodes = function (rootElement) {

    var elems = rootElement.getElementsByTagName('NODES');
    if (elems == null) {
        return "NODES element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'NODES' element found.";
    }

    this['root'] = elems[0].children[0].id;
    var nModes = elems[0].children.length;
    for (var i = 1; i < nModes; i++) {
        var e = elems[0].children[i];

        this.parseLSXNode(e);
    }
};

MySceneGraph.prototype.parseLSXNode = function (element) {
    this[element.id] = new Node();
    this[element.id].setMaterial(this.reader.getString(element.children[0], 'id', true));
    this[element.id].setTexture(this.reader.getString(element.children[1], 'id', true));

    var matrix = mat4.create();
    mat4.identity(matrix);
    var i = 2;
    while (1) {
        if (element.children[i].tagName === 'TRANSLATION') {
            var translate = this.parseTranslation(element.children[i]);
            mat4.translate(
                matrix,
                matrix,
                [
                    translate.x,
                    translate.y,
                    translate.z
                ]
            );
        } else if (element.children[i].tagName === 'ROTATION') {
            var rotation = this.parseRotation(element.children[i]);
            mat4.rotate(
                matrix,
                matrix,
                rotation.angle * Math.PI / 180,
                [
                    rotation.axis == "x" ? 1 : 0,
                    rotation.axis == "y" ? 1 : 0,
                    rotation.axis == "z" ? 1 : 0
                ]
            );
        } else if (element.children[i].tagName === 'SCALE') {
            var scale = this.parseScale(element.children[i]);
            mat4.scale(
                matrix,
                matrix,
                [
                    scale.sx,
                    scale.sy,
                    scale.sz
                ]
            );
        } else
            break;
        i++;
    }

    this[element.id].setMatrix(matrix);

    var nDescendants = element.children[i].children.length;
    for (var j = 0; j < nDescendants; j++) {
        this[element.id].push(this.reader.getString(element.children[i].children[j], 'id', true));
    }

};