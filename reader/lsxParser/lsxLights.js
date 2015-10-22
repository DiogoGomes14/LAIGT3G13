MySceneGraph.prototype.parseLSXLights= function(rootElement) {

    var elems = rootElement.getElementsByTagName('LIGHTS');
    if (elems == null) {
        return "LIGHTS element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'LIGHTS' element found.";
    }

    var lightList=[];
    // iterate over every element
    var nLights=elems[0].children.length;
    for (var i=0; i < nLights; i++)
    {
        var e=elems[0].children[i];
        if(lightList[e] !== undefined){
            console.error("Light " + e + " already exists");
        }
        lightList[e.id] = this.parseLSXLight(e);



    }

    this.lights = this.scene.lights;
    i = 0;
    for (var light in lightList){
        if (lightList.hasOwnProperty(light)) {
            this.lights[i].setPosition(
                lightList[light].position.x,
                lightList[light].position.y,
                lightList[light].position.z,
                lightList[light].position.w
            );
            this.lights[i].setAmbient(
                lightList[light].ambient.r,
                lightList[light].ambient.g,
                lightList[light].ambient.b,
                lightList[light].ambient.a
            );
            this.lights[i].setDiffuse(
                lightList[light].diffuse.r,
                lightList[light].diffuse.g,
                lightList[light].diffuse.b,
                lightList[light].diffuse.a
            );
            this.lights[i].setSpecular(
                lightList[light].specular.r,
                lightList[light].specular.g,
                lightList[light].specular.b,
                lightList[light].specular.a
            );
            this.lights[i].name = light;

            if(lightList[light].enable){
                this.scene[light] = true;
                this.lights[i].enable();
            } else {
                this.scene[light] = false;
            }

            this.scene.application.interface.addLightsSwitch(light);
            i++;
        }
    }
};

MySceneGraph.prototype.parseLSXLight = function(element) {
    var light = [];

    light['enable'] = this.reader.getBoolean(element.children[0], 'value', true);
    light['position'] = this.parsePosition(element.children[1]);
    light['ambient'] = this.parseColour(element.children[2]);
    light['diffuse'] = this.parseColour(element.children[3]);
    light['specular'] = this.parseColour(element.children[4]);

    return light;
};

MySceneGraph.prototype.parseColour = function(element) {
    var arr = [];
    arr['r'] = this.reader.getFloat(element, 'r', true );
    arr['g'] = this.reader.getFloat(element, 'g', true );
    arr['b'] = this.reader.getFloat(element, 'b', true );
    arr['a'] = this.reader.getFloat(element, 'a', true );
    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number" || arr[e] < 0 || arr[e] > 1)
                console.error('Error parsing ' + e + ' in parseColour');
        }
    }
    return arr;
};

MySceneGraph.prototype.parsePosition = function(element) {
    var arr = [];
    arr['x'] = this.reader.getFloat(element, 'x', true );
    arr['y'] = this.reader.getFloat(element, 'y', true );
    arr['z'] = this.reader.getFloat(element, 'z', true );
    arr['w'] = this.reader.getFloat(element, 'w', true );
    for(var e in arr){
        if(arr.hasOwnProperty(e)){
            if(typeof(arr[e]) != "number")
                console.error('Error parsing ' + e + ' in parsePosition');
        }
    }
    return arr;
};