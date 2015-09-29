
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseLSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseLSX = function(rootElement) {
	var error;
	if(error = (this.parseInitials(rootElement) != null)){
		return error;
	}

	if(error = (this.parseLSXIlumination(rootElement) != null)){
		return error;
	}

	if(error = (this.parseLSXLights(rootElement) != null)){
		return error;
	}

};

MySceneGraph.prototype.parseInitials = function(rootElement) {
	var elems = rootElement.getElementsByTagName('INITIALS');
	if(elems === null) {
		return "initials element is missing.";
	}

	if(elems.length != 1) {
		return "either zero or more than one 'initials' element found.";
	}

	this.initials = [];
	this.initials['frustum'] = this.parseFrustum(elems[0].children[0]);
	this.initials['translate'] = this.parseTranslate(elems[0].children[1]);
	this.initials['rotate1'] = this.parseRotation(elems[0].children[2]);
	this.initials['rotate2'] = this.parseRotation(elems[0].children[3]);
	this.initials['rotate3'] = this.parseRotation(elems[0].children[4]);
	this.initials['scale'] = this.parseScale(elems[0].children[5]);
	this.initials['reference'] = this.reader.getFloat(elems[0].children[6], 'length', true);
/*
	this.initials = [];
	this.initials.push(this.parseFrustum(elems[0].children[0]));
	this.initials.push(this.parseTranslate(elems[0].children[1]));
	this.initials.push(this.parseRotation(elems[0].children[2]));
	this.initials.push(this.parseRotation(elems[0].children[3]));
	this.initials.push(this.parseRotation(elems[0].children[4]));
	this.initials.push(this.parseScale(elems[0].children[5]));
	this.initials.push(this.parseReference(elems[0].children[6]));

	this.camera = new CGFcamera(0.4, this.initials[0][0], this.initials[0][1], vec3.fromValues(this.initials[1][0], this.initials[1][1], this.initials[1][2]), vec3.fromValues(0, 0, 0));
	this.camera.orbit(this.initials[2][0], this.initials[2][1]);
	this.camera.orbit(this.initials[3][0], this.initials[3][1]);
	this.camera.orbit(this.initials[4][0], this.initials[4][1]);
*/
};

//TODO apply doubleside
MySceneGraph.prototype.parseLSXIlumination= function(rootElement) {

	var elems = rootElement.getElementsByTagName('ILUMINATION');
	if (elems == null) {
		return "ILUMINATION element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'ILUMINATION' element found.";
	}

	this.ilumination = [];
	this.ilumination['ambient'] = this.parseColour(elems[0].children[0]);
	this.ilumination['doubleside'] = this.reader.getBoolean(elems[0].children[1], 'value', true );
	this.ilumination['background'] = this.parseColour(elems[0].children[2]);

	/*
	this.ilumination = [];
	this.ilumination.push(this.parseColour(elems[0].children[0]));
	this.ilumination.push(this.reader.getBoolean(elems[0].children[1], 'value', true ));
	this.ilumination.push(this.parseColour(elems[0].children[2]));
	*/
};

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
			this.lights[i].setVisible(lightList[light].enable);
			this.lights[i].enable();
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

MySceneGraph.prototype.parseTranslate = function(element) {
	var arr = [];
	arr['x'] = this.reader.getFloat(element, 'x', true);
	arr['y'] = this.reader.getFloat(element, 'y', true);
	arr['z'] = this.reader.getFloat(element, 'z', true);
	for(var e in arr){
		if(arr.hasOwnProperty(e)){
			if(typeof(arr[e]) != "number")
				console.error('Error parsing ' + e + ' in parseTranslate');
		}
	}
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

MySceneGraph.prototype.parseColour = function(element) { //TODO verify if floats are between 0.0 and 1.0
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


/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems = rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	}

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};
