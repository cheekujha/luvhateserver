// var database = require("database.js");

module.exports = (function(){
	var Model = require("./Model.js");
	function Location(seed){
		this.init(seed);
	}
	Location._column_names =[
		// {
		// 	name : 'longitude',
		// 	type : 'float'
		// },{
		// 	name : 'lattitude',
		// 	type : 'float'
		// }
		{
			name : 'position',
			type : 'Position'
		},{
			name : 'accuracy',
			type : 'string'
		},{
			name : 'placeName',
			type : 'string'
		},{
			name : 'vicinity',
			type : 'string'
		},{
			name : 'id',
			type : 'uuid'
		}
	];
	Location._collection_name = "locations";

	Location._save_in_db = false;

	Model.extend(Location);


	/*---------------Class Methods--------------------*/

	/*---------------Prototye Methods------------------*/

	return Location;
}());