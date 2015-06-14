module.exports = (function(){
	var Util = {};

	Util.isUndefined = function(str, emptyStringCheck){
		if(typeof str === "undefined" || str === null || str === "undefined" || str === "null"){
			return true
		}
		if(emptyStringCheck && str.toString().trim().length === 0){
			return true;
		}
		return false;
	}
	return Util;
}());