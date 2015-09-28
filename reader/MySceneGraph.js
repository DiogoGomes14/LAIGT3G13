
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
MySceneGraph.prototype.onXMLReady=function() 
{
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
	this.ilumination.push(this.parseColour(elems[0].children[0]));
	this.ilumination.push(this.reader.getBoolean(elems[0].children[1], 'value', true ));
	this.ilumination.push(this.parseColour(elems[0].children[2]));
};

MySceneGraph.prototype.parseLSXLights= function(rootElement) {

	var elems = rootElement.getElementsByTagName('LIGHTS');
	if (elems == null) {
		return "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'LIGHTS' element found.";
	}

	this.lightList=[];
	// iterate over every element
	var nLights=elems[0].children.length;
	for (var i=0; i < nLights; i++)
	{
		var e=elems[0].children[i];

		this.lightList[e.id] = this.parseLSXLight(e);
	}

	this.lights = this.scene.lights;

	for (var light in this.lightList){
		if (this.lightList.hasOwnProperty(light)) {
			this.lights[light].setPosition(this.lightList[light][1][0], this.lightList[light][1][1], this.lightList[light][1][2], this.lightList[light][1][3]);
			this.lights[light].setAmbient(this.lightList[light][2][0],this.lightList[light][2][1],this.lightList[light][2][2],this.lightList[light][2][3]);
			this.lights[light].setDiffuse(this.lightList[light][3][0],this.lightList[light][3][1],this.lightList[light][3][2],this.lightList[light][3][3]);
			this.lights[light].setSpecular(this.lightList[light][4][0],this.lightList[light][4][1],this.lightList[light][4][2],this.lightList[light][4][3]);
			this.lights[light].setVisible(this.lightList[light][0]);
			this.lights[light].enable();
		}
	}
};

MySceneGraph.prototype.parseLSXLight = function(element) {
	var light = [];

	light.push(this.reader.getBoolean(element.children[0], 'value', true));
	light.push(this.parsePosition(element.children[1]));
	light.push(this.parseColour(element.children[2]));
	light.push(this.parseColour(element.children[3]));
	light.push(this.parseColour(element.children[4]));

	return light;
};

MySceneGraph.prototype.parseTranslate = function(element) {
	var arr = [];
	arr[0] = this.reader.getFloat(element, 'x', true);
	arr[1] = this.reader.getFloat(element, 'y', true);
	arr[2] = this.reader.getFloat(element, 'z', true);
	return arr;
};

MySceneGraph.prototype.parseRotation = function(element) {
	var arr = [];
	arr[0] = this.reader.getString(element, 'axis', true);
	arr[1] = this.reader.getFloat(element, 'angle', true);
	return arr;
};

MySceneGraph.prototype.parseScale = function(element) {
	var arr = [];
	arr[0] = this.reader.getFloat(element, 'sx', true);
	arr[1] = this.reader.getFloat(element, 'sy', true);
	arr[2] = this.reader.getFloat(element, 'sz', true);
	return arr;
};

MySceneGraph.prototype.parseReference = function(element) {
	var arr = [];
	arr[0] = this.reader.getFloat(element, 'length', true);
	return arr;
};

MySceneGraph.prototype.parseFrustum = function(element) {
	var arr = [];
	arr[0] = this.reader.getFloat(element, 'near', true);
	arr[1] = this.reader.getFloat(element, 'far', true);
	return arr;
};

MySceneGraph.prototype.parseColour = function(element) { //TODO verify if floats are between 0.0 and 1.0
	var arr = [];
	arr[0] = this.reader.getFloat(element, 'r', true );
	arr[1] = this.reader.getFloat(element, 'g', true );
	arr[2] = this.reader.getFloat(element, 'b', true );
	arr[3] = this.reader.getFloat(element, 'a', true );
	return arr;
};

MySceneGraph.prototype.parsePosition = function(element) { //TODO verify if floats are between 0.0 and 1.0
	var arr = [];
	arr[0] = this.reader.getFloat(element, 'x', true );
	arr[1] = this.reader.getFloat(element, 'y', true );
	arr[2] = this.reader.getFloat(element, 'z', true );
	arr[3] = this.reader.getFloat(element, 'w', true );
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
	};

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};
