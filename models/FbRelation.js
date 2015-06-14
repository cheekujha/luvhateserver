module.exports = (function(){
	var Model = require("./Model.js");

	function FbRelation(seed){
		this.init(seed);
	}

	FbRelation._column_names = [{
		"name" : "id",
		"type" : "uuid"
	},{
		"name" : "from_id",
		"type" : "string"
	},{
		"name" : "from_name",
		"type" : "string"
	},{
		"name" : "receiver_id",
		"type" : "string"
	},{
		"name" : "receiver_name",
		"type" : "string"
	},{
		"name" : "type",
		"type" : "string"
	},{
		"name" : "created_at",
		"type" : "dateTime",
		"required" : false
	},{
		"name" : "updated_at",
		"type" : "dateTime",
		"required" : false
	}];

	FbRelation._collection_name = "fbRelations";

	FbRelation._save_in_db = true; 

	Model.extend(FbRelation);

	FbRelation.findById = function(id, callback){
		FbRelation.findAll({where:{id:id}}, callback);
	}

	FbRelation.findByFromIdAndReceiverId = function(fromId, receiverId, callback){
		FbRelation.findAll({where:{from_id: fromId, receiver_id : receiverId}},callback);
	}

	FbRelation.findByFromId = function(fromId, callback){
		FbRelation.findAll({where:{from_id: fromId}},callback);
	}

	return FbRelation;
}());