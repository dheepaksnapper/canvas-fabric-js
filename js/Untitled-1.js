// Add image from local
var canvas = new fabric.Canvas('c');
// display/hide text controls
canvas.on('object:selected', function(e) {
   if (e.target.type === 'i-text') {
      document.getElementById('textControls').hidden = false;
   }
});
canvas.on('before:selection:cleared', function(e) {
   if (e.target.type === 'i-text') {
      document.getElementById('textControls').hidden = true;
   }
});
document.getElementById('file').addEventListener("change", function(e) {
   var file = e.target.files[0];
   var reader = new FileReader();
   reader.onload = function(f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function(img) {
         var oImg = img.set({
            left: 0,
            top: 0,
            angle: 0,
            border: '#000',
            stroke: '#F0F0F0', //<-- set this
            strokeWidth: 40 //<-- set this
         }).scale(0.2);
         canvas.add(oImg).renderAll();
         //var a = canvas.setActiveObject(oImg);
         var dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
         });
      });
   };
   reader.readAsDataURL(file);
});


document.getElementById('file2').addEventListener("change", function(e) {
   var file = e.target.files[0];
   var reader = new FileReader();
   reader.onload = function(f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function(img) {
         // add background image
         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
         });
      });
   };
   reader.readAsDataURL(file);
});

// Delete selected object
window.deleteObject = function() {
      var activeGroup = canvas.getActiveGroup();
      if (activeGroup) {
         var activeObjects = activeGroup.getObjects();
         for (let i in activeObjects) {
            canvas.remove(activeObjects[i]);
         }
         canvas.discardActiveGroup();
         canvas.renderAll();
      } else canvas.getActiveObject().remove();
   }
   // Refresh page
function refresh() {
   setTimeout(function() {
      location.reload()
   }, 100);
}
// Add text
function Addtext() {
   canvas.add(new fabric.IText('Tap and Type', {
      left: 50,
      top: 100,
      fontFamily: 'helvetica neue',
      fill: '#000',
      stroke: '#fff',
      strokeWidth: .1,
      fontSize: 45
   }));
}
// Edit Text
document.getElementById('text-color').onchange = function() {
   canvas.getActiveObject().setFill(this.value);
   canvas.renderAll();
};
document.getElementById('text-color').onchange = function() {
   canvas.getActiveObject().setFill(this.value);
   canvas.renderAll();
};
document.getElementById('text-bg-color').onchange = function() {
   canvas.getActiveObject().setBackgroundColor(this.value);
   canvas.renderAll();
};
document.getElementById('text-lines-bg-color').onchange = function() {
   canvas.getActiveObject().setTextBackgroundColor(this.value);
   canvas.renderAll();
};
document.getElementById('text-stroke-color').onchange = function() {
   canvas.getActiveObject().setStroke(this.value);
   canvas.renderAll();
};
document.getElementById('text-stroke-width').onchange = function() {
   canvas.getActiveObject().setStrokeWidth(this.value);
   canvas.renderAll();
};
document.getElementById('font-family').onchange = function() {
   canvas.getActiveObject().setFontFamily(this.value);
   canvas.renderAll();
};
document.getElementById('text-font-size').onchange = function() {
   canvas.getActiveObject().setFontSize(this.value);
   canvas.renderAll();
};
document.getElementById('text-line-height').onchange = function() {
   canvas.getActiveObject().setLineHeight(this.value);
   canvas.renderAll();
};
document.getElementById('text-align').onchange = function() {
   canvas.getActiveObject().setTextAlign(this.value);
   canvas.renderAll();
};
radios5 = document.getElementsByName("fonttype"); // wijzig naar button
for (var i = 0, max = radios5.length; i < max; i++) {
   radios5[i].onclick = function() {
      if (document.getElementById(this.id).checked == true) {
         if (this.id == "text-cmd-bold") {
            canvas.getActiveObject().set("fontWeight", "bold");
         }
         if (this.id == "text-cmd-italic") {
            canvas.getActiveObject().set("fontStyle", "italic");
         }
         if (this.id == "text-cmd-underline") {
            canvas.getActiveObject().set("textDecoration", "underline");
         }
         if (this.id == "text-cmd-linethrough") {
            canvas.getActiveObject().set("textDecoration", "line-through");
         }
         if (this.id == "text-cmd-overline") {
            canvas.getActiveObject().set("textDecoration", "overline");
         }
      } else {
         if (this.id == "text-cmd-bold") {
            canvas.getActiveObject().set("fontWeight", "");
         }
         if (this.id == "text-cmd-italic") {
            canvas.getActiveObject().set("fontStyle", "");
         }
         if (this.id == "text-cmd-underline") {
            canvas.getActiveObject().set("textDecoration", "");
         }
         if (this.id == "text-cmd-linethrough") {
            canvas.getActiveObject().set("textDecoration", "");
         }
         if (this.id == "text-cmd-overline") {
            canvas.getActiveObject().set("textDecoration", "");
         }
      }
      canvas.renderAll();
   }
}
// Send selected object to front or back
var selectedObject;
canvas.on('object:selected', function(event) {
   selectedObject = event.target;
});
var sendSelectedObjectBack = function() {
   canvas.sendToBack(selectedObject);
}
var sendSelectedObjectToFront = function() {
      canvas.bringToFront(selectedObject);
   }
   // Download
var imageSaver = document.getElementById('lnkDownload');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e) {
   this.href = canvas.toDataURL({
      format: 'png',
      quality: 0.8
   });
   this.download = 'custom.png'
}
// Do some initializing stuff
fabric.Object.prototype.set({
   transparentCorners: true,
   cornerColor: '#22A7F0',
   borderColor: '#22A7F0',
   cornerSize: 12,
   padding: 5
});