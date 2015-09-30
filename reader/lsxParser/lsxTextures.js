MySceneGraph.prototype.parseLSXTextures = function(rootElement) {
    var elems = rootElement.getElementsByTagName('TEXTURES');
    if(elems === null) {
        return "TEXTURES element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'TEXTURES' element found.";
    }

    this.textures = [];
    // iterate over every element
    var nTextures = elems[0].children.length;
    for (var i=0; i < nTextures; i++)
    {
        var e = elems[0].children[i];

        this.textures[e.id] = this.parseLSXTexture(e);
    }

};

MySceneGraph.prototype.parseLSXTexture = function(element) {
    var texture = [];

    texture['file'] = this.reader.getString(element.children[0], 'path', true);
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
                console.error('Error parsing ' + e + ' in parseTranslate');
        }
    }
    return arr;
};