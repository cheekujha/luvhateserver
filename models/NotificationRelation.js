module.exports = (function(){
	var Model = require("./Model.js");

	function NotificationRelation(seed){
		this.init(seed);
	};

	NotificationRelation._column_names = [
		{
			"name" : "id",
			"type" : "uuid"
		},
		{
			"name" : "user_id",
			"type" : "string"
		},
		{
			"name" : "registration_id",
			"type" : "string"
		}
	];

	NotificationRelation._collection_name = "notificationrelations";

	NotificationRelation._save_in_db = true;

	Model.extend(NotificationRelation);

	NotificationRelation.findByUserIdAndRegistrationId = function(userId, registrationId, callback){
		NotificationRelation.findAll({where : {'user_id' : userId, 'registration_id' : registrationId}, select : {'_id' : 0}}, callback);
	};

	NotificationRelation.findByRegistrationId = function(registrationId, callback){
		NotificationRelation.findAll({where : {'registration_id' : registrationId}, select : {'_id' : 0}}, callback);
	};

	NotificationRelation.findByUserId = function(userId, callback){
		NotificationRelation.findAll({where : {'user_id' : userId}, select : {'_id' : 0}}, callback);
	}

	return NotificationRelation;
}());