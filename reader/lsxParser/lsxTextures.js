MySceneGraph.prototype.parseLSXTextures = function(rootElement) {
    var elems = rootElement.getElementsByTagName('TEXTURES');
    if(elems === null) {
        return "TEXTURES element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'TEXTURES' element found.";
    }

    this.scene.lsxTextures = [];
    // iterate over every element
    var nTextures = elems[0].children.length;
    for (var i=0; i < nTextures; i++)
    {
        var e = elems[0].children[i];

        this.scene.lsxTextures[e.id] = this.parseLSXTexture(e);
    }
};

MySceneGraph.prototype.parseLSXTexture = function(element) {
    var texture = [];

    texture['file'] = this.parseFileLocation(element.children[0]);
    texture['texture'] = new CGFtexture(this.scene, texture['file']);
    texture['amp_factor'] = this.parseAmplificationFactor(element.children[1]);

    return texture;
};

MySceneGraph.prototype.parseAmplificationFactor = function(element) {
    var arr = [];
    arr['s'] = this.reader.getFloat(element, 's', true);
    arr['t'] = this.reader.getFloat(element, 't', true);
    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number")
                console.error('Error parsing ' + e + ' in parseAmplificationFactor');
        }
    }
    return arr;
};

MySceneGraph.prototype.parseFileLocation = function(element) {
    var file;
    file = this.reader.getString(element, 'path', true);
    var temp = this.reader.xmlfile.substring(0, this.reader.xmlfile.lastIndexOf("/"));
    file = temp + "/" +  file;

    return file;
};