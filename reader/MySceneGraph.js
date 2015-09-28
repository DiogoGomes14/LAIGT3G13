
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
	var error = this.parseLSXIlumination(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
	var a = this.parseLSXLights(rootElement);
	if( a != null) {
		this.onXMLError(a);
		return;
	}

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
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

MySceneGraph.prototype.parseLSXLight = function(element) {
	var light = [];
	light.push(this.reader.getBoolean(element.children[0], 'value', true));
	light.push(this.parsePosition(element.children[1]));
	light.push(this.parseColour(element.children[2]));
	light.push(this.parseColour(element.children[3]));
	light.push(this.parseColour(element.children[4]));

	return light;
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
		//this.lightList.push(this.parseLSXLight(e));
	};

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


