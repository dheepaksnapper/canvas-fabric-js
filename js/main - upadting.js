var canvas, brushSize, brushColor, strokeColor, fillColor, f = fabric.Image.filters;;

function initiateFabricCanvas(width, height) {
    canvas = new fabric.Canvas('c',
    {
        isDrawingMode : false,
        selection : true,
        width : width,
        height : height,
        preserveObjectStacking : false 
    });
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
}

function insertShape() {

    let shape;
    switch (this.id) {
        case 'btn-shape-circle':
            shape = new fabric.Circle({
                fill : fillColor.val(),
                stroke : strokeColor.val(),
                strokeWidth : 2,
                top : 10,
                left : 10,
                radius : 50
            });
            break;
        case 'btn-shape-line' :
            shape = new fabric.Line([10,10,50,50], {
                stroke : strokeColor.val(),
                strokeWidth : 2
            });
            break;
        case 'btn-shape-ellipse':
            shape = new fabric.Ellipse({
                stroke : strokeColor.val(),
                strokeWidth : 2,
                fill : fillColor.val(),
                rx : 30,
                ry : 30
            });
            break;
        case 'btn-shape-polygon':
            shape = new fabric.Polyline([
                { x: 20, y: 10 },
                { x: 50, y: 10 },
                { x: 60, y: 20 },
                { x: 60, y: 50 },
                { x: 50, y: 60 },
                { x: 20, y: 60 },
                { x: 10, y: 50 },
                { x: 10, y: 20 },
                { x: 20, y: 10 },
              ], {
              stroke: strokeColor.val(),
              fill : fillColor.val(),
              left: 10,
              top: 10
            });;
            break;
        case 'btn-shape-rectangle':
            shape = new fabric.Rect({
                stroke : strokeColor.val(),
                strokeWidth : 2,
                fill : fillColor.val(),
                top : 10,
                left : 10,
                height : 70,
                width : 100
            });
            break;
        case 'btn-shape-triangle':
            shape = new fabric.Triangle({
                stroke : strokeColor.val(),
                strokeWidth : 2,
                fill : fillColor.val(),
                top : 10,
                left : 10,
                height : 100,
                width : 70,
            })
            break;
        default:
            console.log('invalid Shape');
            break;
    }
    shape.set({selection : false});
    canvas.add(shape);
    canvas.renderAll();
}

function setCanvasBackground(imageFile) {
    fabric.Image.fromURL(imageFile, function (image) {
        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
            scaleX : canvas.width / image.width,
            scaleY : canvas.height / image.height
        });
    });
}

function insertImage(imageFile) {  
    fabric.Image.fromURL(imageFile, function(image){
        canvas.add(image);
    });
}

function insertText(event, text) {
    if(event.data.input.val() == '' || text == '') { return; }
    let value = event ? event.data.input.val() : text;
    canvas.add(new fabric.IText(value));
}

function insertSVG(event) {
    fabric.loadSVGFromString(event.data.input.val(), function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        canvas.add(obj).centerObject(obj).renderAll();
        obj.setCoords();
    });
}

function setBrushProperties() {
    canvas.freeDrawingBrush.color = brushColor.val();
    canvas.freeDrawingBrush.width = parseInt(brushSize.val());
}

function textStyleChangedEventHandler() {
    let activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(object => {
        prop = this.name.split('_', 2);
        if(prop[0] == 'textDecoration') {
            object.set(prop[1], !object[prop[1]]);
        }
        else {
            object.set(prop[0], object[prop[0]] == prop[1] ? '' : prop[1]);
        }
    });
    canvas.renderAll();
}

function shapesPropertiesChangedEventHandler () {
    let activeObjects = canvas.getActiveObjects();
    if(activeObjects.length) {
        activeObjects.forEach(object => {
            let value;
            if (this.name == 'strokeWidth') value = parseInt(this.value, 10);
            else if (this.name == 'opacity') value = this.value / 100;
            else value = this.value;
            object.set(this.name,  value);
        });
    }
    canvas.renderAll();
}


function setObjectProperty(pName, pValue) {
    let activeObjects = canvas.getActiveObjects();
    if(activeObjects.length) {
        activeObjects.forEach(object => {
            object.set(pName, pValue);
        });
    }
}

function textPropertiesChanedEventHandler () {
    let activeObjects = canvas.getActiveObjects();
    activeObjects.forEach(object => {
        object.set(this.name, this.name == 'opacity' ? this.value / 100 : this.value); // since the opacity value slides from 0 to 1
        console.log(this.value);
    });
    canvas.renderAll();
}

function enableShapesProperties () {
    $.each($('#shapes-properties-div input'), function (index, value) {
        $(this).on('change', shapesPropertiesChangedEventHandler);
    });
}

function enableTextStyleProperties() {
    $.each($('#text-style-div a'), function (index, value) {
        $(this).on('click', textStyleChangedEventHandler);
    });
}

function enableTextProperties() {
    $.each($('#text-properties-div input'), function (index, value) {
        $(this).on('change', textPropertiesChanedEventHandler);
    });
    $('#font-family').on('change', textPropertiesChanedEventHandler);
}

function disableShapesProperties () {
    $.each($('#shapes-properties-div input'), function (index, value) {
        $(this).off('change');
    });
}

function disableTextStyleProperties () {
    $.each($('#text-style-div a'), function () {
        $(this).off('click');
    });
}

function diableTextProperties() {
    $.each($('#text-properties-div input'), function () {
        $(this).off('change');
    });
    $('#font-family').off('change');

}

function deleteObjects () {
    let activeObjects = canvas.getActiveObjects();
    if(activeObjects.length) {
        activeObjects.forEach(object => {
             canvas.remove(object);
        });
        canvas.discardActiveObject();
    }
}

function changeObjectStackFrontandBack () {
    let activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
        activeObjects.forEach(object => {
            canvas[this.name](object);
            // console.log(object);
        });
    }
}

function applyFilter(index, filter) {
    let obj = canvas.getActiveObject();
    if(obj) {
        obj.filters[index] = filter;
        obj.applyFilters();
        canvas.renderAll();
    }
  }

$(document).ready(function () {
    
    initiateFabricCanvas(960,720);
    
    brushSize = $('#brush-size');
    brushColor = $('#brush-color');
    fillColor = $('#shape-fill-color');
    strokeColor = $('#shape-stroke-color');
    console.log(strokeColor.val());

    // trail and error method 
    $('#btn-try').on('click', function (event) {
        console.log('trail and error triggered !');
        console.log(trail);
        

    });
    
    //handlers-common

    // for changing file name in lable 
    $('#input-image').on('change', function () {
        this.nextElementSibling.innerText = this.files[0].name;
    });

    $('#btn-clear-canvas').on('click', function () {
        if (confirm('do u want to clear the whole canavs')) canvas.clear();
        else return; 

    });

    $(this).keydown(function (e) { 
        if (canvas.getActiveObjects().length && e.keyCode == 46) {
            deleteObjects();
        }
    });

    canvas.on('selection:created', function (options) {
        $("#shapes-properties-div").toggleClass('enablediv disablediv');
        enableShapesProperties();
        enableTextProperties();
        enableTextStyleProperties();
    });

    canvas.on('selection:cleared', function (options) {
        console.log('selection cleared');
        $("#shapes-properties-div").toggleClass('enablediv disablediv');
        disableShapesProperties();
        diableTextProperties();
        disableTextStyleProperties();
    });

    $('#input-preserveObjectStacking').on('change', function () {
        canvas.preserveObjectStacking = !canvas.preserveObjectStacking;
    });

    $('#btn-delete').on('click', deleteObjects);

    $('#aspect-ratio').on('change', function() {
        let dimention = this.value.split('*', 2);
        canvas.setWidth(parseInt(dimention[0]));
        canvas.setHeight(parseInt(dimention[1]))
    });

    //handlers-shapesTab
    $('#btn-draw-mode').on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('btn-dark btn-success');
        $('#btn-delete').prop('disabled', (i,v) => !v)
        toggleDrawingMode();
        setBrushProperties();
    });
 
    $('#brush-type').on('change', function () {
        console.log(this.value + 'Brush');
        canvas.freeDrawingBrush = new fabric[ this.value + 'Brush' ](canvas);
        setBrushProperties();
    });

    $('#brush-size').on('change', function () {
        console.log(this);
        canvas.freeDrawingBrush.width = parseInt(this.value);
        console.log(canvas.freeDrawingBrush.width);
    });

    $('#brush-color').on('change', function () {
        canvas.freeDrawingBrush.color = this.value;
        console.log(canvas.freeDrawingBrush.color);
    });

    $.each($('#shapes-div a'), function () { 
        $(this).on('click', insertShape);
    });

    $.each($('#shapes-stacking-div a'), function () {
        $(this).on('click', changeObjectStackFrontandBack); 
    });

    // image filters
    $('#invert').on('click', function() {
        applyFilter(1, this.checked && new f.Invert());
    });

    $('#brownie').on('change', function() {
        applyFilter(4, this.checked && new f.Brownie());
    });

    $('#vintage').on('change', function () {
        applyFilter(9, this.checked && new f.Vintage());
    });

    $('#technicolor').on('change', function () {
        applyFilter(14, this.checked && new f.Technicolor());
    });
    
    $('#polaroid').on('change', function () {
        applyFilter(15, this.checked && new f.Polaroid());
    });

    $('#kodachrome').on('change', function () {
        applyFilter(18, this.checked && new f.Kodachrome());
    });

    $('#blackwhite').on('change', function () {
        applyFilter(19, this.checked && new f.BlackWhite());
    });

    $('#grayscale').on('change', function () {
        applyFilter(0, this.checked && new f.Grayscale());
    });

    //canvs-tab handlers

    // set background button
    $('#input-background-image').on('change', function(e) {
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(f) {
            setCanvasBackground(f.target.result);
        }
        fileReader.readAsDataURL(file);
    });

    // set backgroundcolor
    $('#canvas-backgroundColor').on('change', function (e) { 
        canvas.setBackgroundColor(this.value);
        canvas.renderAll();
    });

    // handlers textTab
    $('#btn-insert-text').on('click', { input : $('#smaple-text') }, insertText);

    // insert iamge button
    $('#input-image').on('change', function (e) {
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(f) {
            insertImage(f.target.result);
        }
        fileReader.readAsDataURL(file);
    });

    // download image
    $('#btn-download').on('click', function () {
        window.open(canvas.toDataURL('jpg'));
    });

    $('#btn-insert-svg').on('click', { input : $('#text-area-svg') }, insertSVG);
    
    canvas.add(new fabric.IText('Belive U,\nBe U,\nBe the Best of U.'));

});