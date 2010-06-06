/*
---
name: ART.Script
description: "ART Script stubs for ART"
provides: [ART.Script, ART.Script.Group, ART.Script.Shape]
requires: [ART, ART.Element, ART.Container, ART.Path]
...
*/

(function(){

// Global AST Variables

var classVar = new AST.Variable('Class'),
	artVar = new AST.Variable('ART'),
	artShape = artVar.property('Shape'),
	artGroup = artVar.property('Group');
	
Color.prototype.toExpression = Color.prototype.toHEX;

// ART Script Base Class

ART.Script = new Class({

	Extends: ART.Element,
	Implements: ART.Container,

	initialize: function(width, height){
		this.resize(width, height);
		this.children = [];
	},

	resize: function(width, height){
		this.width = width;
		this.height = height;
		return this;
	},

	toExpression: function(){
		var expr = artVar.construct(this.width, this.height);
		if (!this.children.length) return expr;
		return new AST.Call(expr.property('grab'), this.children);
	},

	toClass: function(){
		var self = new AST.This(),
			callParent = self.property('parent').call(this.width, this.height);

		return classVar.construct({

			Extends: artVar,

			initialize: new AST.Function(null, null, this.children.length ? [callParent, new AST.Call(self.property('grab'), this.children)] : [callParent])

		});
	}

});

// ART Script Element Class

ART.Script.Element = new Class({
	
	Extends: ART.Element,

	initialize: function(){
		this._calls = [];
	},

	_addCall: function(property, args){
		this._calls.push({ prop: property, args: Array.prototype.slice.call(args) });
		return this;
	},
	
	toExpression: function(expr){
		var calls = this._calls;
		for (var i = 0, l = calls.length; i < l; i++){
			var call = calls[i];
			expr = new AST.Call(expr.property(call.prop), call.args);
		}
		return expr;
	},

	// insertions
	
	inject: function(container){
		this.eject();
		if (container.children) container.children.push(this);
		this.container = container;
		return this;
	},
	
	eject: function(){
		if (this.container && this.container.children) this.container.children.erase(this);
		this.container = null;
		return this;
	},
	
	// transforms
	
	rotate: function(deg, x, y){ return this._addCall('rotate', arguments); },

	scale: function(x, y){ return this._addCall('scale', arguments); },

	translate: function(x, y){ return this._addCall('translate', arguments); },
	
	setOpacity: function(opacity){ return this._addCall('setOpacity', arguments); },

	// visibility
	
	hide: function(){ return this._addCall('hide', arguments); },
	
	show: function(){ return this._addCall('show', arguments); },
	
	// ignore
	
	listen: function(){
		return this;
	},
	
	ignore: function(){
		return this;
	}
	
});

// ART Script Group Class

ART.Script.Group = new Class({

	Extends: ART.Script.Element,
	Implements: ART.Container,

	initialize: function(){
		this.parent();
		this.children = [];
	},

	measure: function(){
		return ART.Path.measure(this.children.map(function(child){
			return child.currentPath;
		}));
	},

	toExpression: function(){
		var grab = artGroup.construct().property('grab'),
			children = this.children.map(function(child){ return child.toExpression(); });
		return new AST.Call(grab, children);
	},

	toClass: function(){
		var self = new AST.This(),
			callParent = self.property('parent').call();

		return classVar.construct({

			Extends: artGroup,

			initialize: new AST.Function(null, null, this.children.length ? [callParent, new AST.Call(self.property('grab'), this.children)] : [callParent])

		});
	}

});

// ART Script Base Shape Class

ART.Script.Base = new Class({
	
	Extends: ART.Script.Element,

	/* styles */
	
	fill: function(color){ return this._addCall('fill', arguments); },

	fillRadial: function(stops, focusX, focusY, radius, centerX, centerY){ return this._addCall('fillRadial', arguments); },

	fillLinear: function(stops, angle){
		if (angle == null) return this._addCall('fill', stops);
		return this._addCall('fillLinear', arguments);
	},

	stroke: function(color, width, cap, join){ return this._addCall('stroke', arguments); }	
	
});

// ART Script Shape Class

ART.Script.Shape = new Class({
	
	Extends: ART.Script.Base,
	
	initialize: function(path){
		this.parent('path');
		if (path != null) this.draw(path);
	},
	
	getPath: function(){
		return this.currentPath || new ART.Path;
	},
	
	draw: function(path){
		this.currentPath = (path instanceof ART.Path) ? path : new ART.Path(path);
		return this;
	},
	
	measure: function(){
		return this.getPath().measure();
	},

	toExpression: function(expr){
		if (!expr) expr = this.currentPath ? artShape.construct(this.currentPath.toString()) : artShape.construct();
		return this.parent(expr);
	},

	toClass: function(){
		var self = new AST.This(),
			parent = self.property('parent'),
			callParent = this.currentPath ? parent.call(this.currentPath.toString()) : parent.call(),
			callMethods = this.toExpression(self);

		return classVar.construct({

			Extends: artShape,

			initialize: new AST.Function(null, null, callMethods === self ? [callParent] : [callParent, callMethods])

		});
	}

});

})();
