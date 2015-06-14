// var database = require("database.js");

module.exports = (function(){
	var stringProto = String.prototype;

	stringProto.escape = function() {
	  var tagsToReplace = {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;'
	  };
	  return this.replace(/[&<>]/g, function(tag) {
	    return tagsToReplace[tag] || tag;
	  });
	};

	stringProto.charAtIsUpperCase = function(index){
		var character = this.charAt(index);
		if(!character){
			return false;
		}

		if(character == character.toUpperCase() && character != character.toLowerCase()){
			return true;
		}else{
			return false;
		}
	}

	stringProto.charAtIsLowerCase = function(index){
		var character = this.charAt(index);
		if(!character){
			return false;
		}

		if(character == character.toLowerCase() && character != character.toUpperCase()){
			return true;
		}else{
			return false;
		}
	}
}());