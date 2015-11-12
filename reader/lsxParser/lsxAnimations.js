MySceneGraph.prototype.parseLSXAnimations = function(rootElement) {
    var elems = rootElement.getElementsByTagName('ANIMATIONS');
    if(elems === null) {
        return "ANIMATIONS element is missing.";
    }

    if(elems.length != 1) {
        return "either zero or more than one 'ANIMATIONS' element found.";
    }

    this.scene.lsxAnimations = [];
    // iterate over every element
    var nAnimations = elems[0].children.length;
    for (var i=0; i < nAnimations; i++)
    {
        var e = elems[0].children[i];

        if(this.scene.lsxAnimations[e] !== undefined){
            console.error("Animation " + e + " already exists");
        }
        this.scene.lsxAnimations[e.id] = this.parseLSXAnimation(e);
    }
    //console.log(this.scene.lsxAnimations);
};

MySceneGraph.prototype.parseLSXAnimation = function(element) {
    var animation = [];

    animation['span'] = this.reader.getFloat(element, 'span', true);
    animation['type'] = this.reader.getString(element, 'type', true);

    if(animation['type'] == "linear"){

        animation["controlPoints"] = [];

        for(var i = 0; i < element.children.length; i++){
            animation["controlPoints"].push(
                {
                    "x" : this.reader.getFloat(element.children[i], 'xx', true),
                    "y" : this.reader.getFloat(element.children[i], 'yy', true),
                    "z" : this.reader.getFloat(element.children[i], 'zz', true)
                }
            )
        }

    } else if(animation['type'] == "circular"){

        animation['center'] = [];

        var tempCenter = this.reader.getString(element, 'center', true);
        var tempArray = tempCenter.split(/\s+/);

        for(i = 0; i < tempArray.length; i++){
            animation['center'][i] = parseFloat(tempArray[i]);
        }

        animation['radius'] = this.reader.getFloat(element, 'radius', true);
        animation['startAng'] = this.reader.getFloat(element, 'startang', true);
        animation['rotAng'] = this.reader.getFloat(element, 'rotang', true);

    } else {
        console.error("Type of animation is wrong");
    }

    return animation;
};