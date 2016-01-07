MySceneGraph.prototype.parseInitials = function(rootElement) {
    var elems = rootElement.getElementsByTagName('INITIALS');
    if(elems === null) {
        return "INITIALS element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'INITIALS' element found.";
    }

    this.scene.lsxInitials = [];
    this.scene.lsxInitials['frustum'] = this.parseFrustum(elems[0].children[0]);
    this.scene.lsxInitials['translation'] = this.parseTranslation(elems[0].children[1]);
    this.scene.lsxInitials['rotate3'] = this.parseRotation(elems[0].children[2]);
    this.scene.lsxInitials['rotate2'] = this.parseRotation(elems[0].children[3]);
    this.scene.lsxInitials['rotate1'] = this.parseRotation(elems[0].children[4]);
    this.scene.lsxInitials['scale'] = this.parseScale(elems[0].children[5]);
    this.scene.lsxInitials['reference'] = this.reader.getFloat(elems[0].children[6], 'length', true);
};

MySceneGraph.prototype.parseTranslation = function(element) {
    var arr = [];
    arr['x'] = this.reader.getFloat(element, 'x', true);
    arr['z'] = this.reader.getFloat(element, 'y', true);
    arr['z'] = this.reader.getFloat(element, 'z', true);
    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number")
                console.error('Error parsing ' + e + ' in parseTranslation');
        }
    }
    arr['type'] = 'translation';
    return arr;
};

MySceneGraph.prototype.parseRotation = function(element) {
    var arr = [];
    arr['axis'] = this.reader.getString(element, 'axis', true);
    if(arr['axis'] != 'x' && arr['axis'] != 'y' && arr['axis'] != 'z'){
        console.error('Error parsing axis in parseRotation');
    }
    arr['angle'] = this.reader.getFloat(element, 'angle', true);
    if(typeof(arr['angle']) != "number"){
        console.error('Error parsing angle in parseRotation');
    }
    arr['type'] = 'rotation';
    return arr;
};

MySceneGraph.prototype.parseScale = function(element) {
    var arr = [];
    arr['sx'] = this.reader.getFloat(element, 'sx', true);
    arr['sy'] = this.reader.getFloat(element, 'sy', true);
    arr['sz'] = this.reader.getFloat(element, 'sz', true);
    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number")
                console.error('Error parsing ' + e + ' in parseScale');
        }
    }
    arr['type'] = 'scale';
    return arr;
};

MySceneGraph.prototype.parseFrustum = function(element) {
    var arr = [];
    arr['near'] = this.reader.getFloat(element, 'near', true);
    arr['far'] = this.reader.getFloat(element, 'far', true);
    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number" || arr[e] < 0 )
                console.error('Error parsing ' + e + ' in parseFrustum');
        }
    }
    return arr;
};