
MySceneGraph.prototype.parseLSXLights = function (rootElement) {

    var elements = rootElement.getElementsByTagName('LIGHTS');
    if (elements == null) {
        return "LIGHTS element is missing.";
    }

    if (elements.length != 1) {
        return "either zero or more than one 'LIGHTS' element found.";
    }

    this.scene.lsxLights = [];
    // iterate over every element
    var nLights = elements[0].children.length;
    for (var i = 0; i < nLights; i++) {
        var e = elements[0].children[i];
        if (this.scene.lsxLights[e] !== undefined) {
            console.error("Light " + e + " already exists");
        }
        this.scene.lsxLights[e.id] = this.parseLSXLight(e);
    }
};

MySceneGraph.prototype.parseLSXLight = function (element) {
    var light = [];

    light['enable'] = this.reader.getBoolean(element.children[0], 'value', true);
    light['position'] = this.parsePosition(element.children[1]);
    light['ambient'] = this.parseColour(element.children[2]);
    light['diffuse'] = this.parseColour(element.children[3]);
    light['specular'] = this.parseColour(element.children[4]);

    return light;
};

MySceneGraph.prototype.parseColour = function (element) {
    var arr = [];
    arr['r'] = this.reader.getFloat(element, 'r', true);
    arr['g'] = this.reader.getFloat(element, 'g', true);
    arr['b'] = this.reader.getFloat(element, 'b', true);
    arr['a'] = this.reader.getFloat(element, 'a', true);
    for (var e in arr) {
        if (arr.hasOwnProperty(e)) {
            if (typeof(arr[e]) != "number" || arr[e] < 0 || arr[e] > 1)
                console.error('Error parsing ' + e + ' in parseColour');
        }
    }
    return arr;
};

MySceneGraph.prototype.parsePosition = function (element) {
    var arr = [];
    arr['x'] = this.reader.getFloat(element, 'x', true);
    arr['z'] = this.reader.getFloat(element, 'y', true);
    arr['z'] = this.reader.getFloat(element, 'z', true);
    arr['w'] = this.reader.getFloat(element, 'w', true);
    for (var e in arr) {
        if (arr.hasOwnProperty(e)) {
            if (typeof(arr[e]) != "number")
                console.error('Error parsing ' + e + ' in parsePosition');
        }
    }
    return arr;
};