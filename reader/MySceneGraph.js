function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */

    this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function () {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseLSX(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseLSX = function (rootElement) {
    var error;
    if (error = (this.parseInitials(rootElement) != null)) {
        console.log("Error parsing Initials");
        return error;
    }

    if (error = (this.parseLSXIllumination(rootElement) != null)) {
        console.log("Error parsing Illumination");
        return error;
    }

    if (error = (this.parseLSXLights(rootElement) != null)) {
        console.log("Error parsing Lights");
        return error;
    }

    if (error = (this.parseLSXTextures(rootElement) != null)) {
        console.log("Error parsing Textures");
        return error;
    }

    if (error = (this.parseLSXMaterials(rootElement) != null)) {
        console.log("Error parsing Materials");
        return error;
    }

    if (error = (this.parseLSXLeaves(rootElement) != null)) {
        console.log("Error parsing Leaves");
        return error;
    }

    if (error = (this.parseLSXNodes(rootElement) != null)) {
        console.log("Error parsing Nodes");
        return error;
    }

    if (error = (this.parseLSXAnimations(rootElement) != null)) {
        console.log("Error parsing Animations");
        return error;
    }
};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function (message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
