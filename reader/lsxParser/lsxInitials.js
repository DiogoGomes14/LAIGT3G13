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
    /*
     this.lsxInitials = [];
     this.lsxInitials.push(this.parseFrustum(elems[0].children[0]));
     this.lsxInitials.push(this.parseTranslation(elems[0].children[1]));
     this.lsxInitials.push(this.parseRotation(elems[0].children[2]));
     this.lsxInitials.push(this.parseRotation(elems[0].children[3]));
     this.lsxInitials.push(this.parseRotation(elems[0].children[4]));
     this.lsxInitials.push(this.parseScale(elems[0].children[5]));
     this.lsxInitials.push(this.parseReference(elems[0].children[6]));

     this.camera = new CGFcamera(0.4, this.lsxInitials[0][0], this.lsxInitials[0][1], vec3.fromValues(this.lsxInitials[1][0], this.lsxInitials[1][1], this.lsxInitials[1][2]), vec3.fromValues(0, 0, 0));
     this.camera.orbit(this.lsxInitials[2][0], this.lsxInitials[2][1]);
     this.camera.orbit(this.lsxInitials[3][0], this.lsxInitials[3][1]);
     this.camera.orbit(this.lsxInitials[4][0], this.lsxInitials[4][1]);
     */
};

MySceneGraph.prototype.parseTranslation = function(element) {
    var arr = [];
    arr['x'] = this.reader.getFloat(element, 'x', true);
    arr['y'] = this.reader.getFloat(element, 'y', true);
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