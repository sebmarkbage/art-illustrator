#target illustrator
#targetengine art
#include "Illustrator.ART.jsxinc"

(function(){

try {
	
	if (!app.documents.length) return;
	var selection = app.selection.length ? app.selection : app.activeDocument;
	var bounds = app.selection.length ? Illustrator.ART.getBoundsFromArray(selection) : selection.artboards[app.activeDocument.artboards.getActiveArtboardIndex()].artboardRect;

	var builder = new Illustrator.ART({ mode: ART.Script, coordinateSpace: bounds }),
		art = builder.parse(selection);

	if (builder.warnings.length) alert('Not all features in the document can be exported.\n- ' + builder.warnings.join('\n- '), 'ART Script Warnings');
	
	if (!art) return;

	var file = File.saveDialog('Save Selection As ART Script', 'ART Script:*.art.js');
	if (!file || (file.exists && !confirm (file.name + ' already exists.\nDo you want to replace it?', true, 'Confirm Save As ART Script'))) return;

	var className = file.name.replace(/(\.art)?\.js$/i, '') || 'Unknown',
		classExpr = null;
	className.split('.').forEach(function(name){
		if (classExpr) classExpr = classExpr.property(name);
		else classExpr = new AST.Variable(name);
	});

	art = new AST(classExpr.assign(art.toClass()));

	if (!file.open('w')) throw new Error('Failed to open file ' + file.name + ' for writing.');
	try {
		art.writeTo(function(str){ file.write(str); });
	} finally {
		file.close();
	}
	
} catch(x) {
	alert(x, 'ART Script', true);
}

})();