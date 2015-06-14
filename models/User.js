// var database = require("database.js");

module.exports = (function(){
	var Model = require("./Model.js");

	function User(seed){
		this.init(seed);
	}

	User._column_names =[{
		"name" : 'id',
		"type" : 'uuid'
	},{
		"name" : 'name',
		"type" : 'string',
		"required" : false
	},{
		"name" : 'fb_id',
		"type" : 'string',
		"required" : true
	},{
		"name" : 'gender',
		"type" : 'string',
		"required" : false
	},{
		"name" : 'access_token',
		"type" : 'string',
		"required" : false
	},{
		"name" : 'love_count',
		"type" : 'integer',
		"required" : false,
		"default" : 0
	},{
		"name" : 'hate_count',
		"type" : 'integer',
		"required" : false,
		"default" : 0
	},{
		"name" : "created_at",
		"type" : "dateTime",
		"required" : false
	},{
		"name" : "updated_at",
		"type" : "dateTime",
		"required" : false
	},{
		"name" : "logged_in",
		"type" : "integer",
		"default" : 0
	}];

	User._collection_name = "users";

	User._save_in_db = true; 

	User.findByFbId = function(id, callback){
		User.findAll({where : {'fb_id' : id}, select : {'_id' : 0}}, callback);
	};

	User.findById = function(id, callback){
		User.findAll({where : {'id' : id}, select : {'_id' : 0}}, callback);
	}

	User.addLoveHateCount = function(fbId, name, type, callback){
		User.findByFbId(fbId, function(docs){
			if(!docs){
				callback && callback();
			}
			if(docs.length > 0){
				//update the User love hate count
				increaseLoveHateCount(docs[0], type, callback);
			}else{
				//create a new User with love/hate count = 1
				createNewUserWithLoveHateCount(fbId, name, type, callback);
			}
		});
	}

	User.subtractLoveHateCount = function(fbId, name, type, callback){
		User.findByFbId(fbId, function(docs){
			if(!docs){
				callback && callback();
			}
			if(docs.length > 0){
				//update the User love hate count
				decreaseLoveHateCount(docs[0], type, callback);
			}else{
				//create a new User with love/hate count = 1
				createNewUserWithLoveHateCount(fbId, name, type, callback);
			}
		});
	}

	User.updateLoveHateCount = function(fbId, name, oldType, newType, callback){
		User.findByFbId(fbId, function(docs){
			if(!docs){
				callback && callback();
			}
			if(docs.length > 0){
				//update the User love hate count
				updateLoveHateCount(docs[0], oldType, newType, callback);
			}else{
				//create a new User with love/hate count = 1
				// createNewUserWithLoveHateCount(fbId, name, type, callback);
			}
		});
	}

	function updateLoveHateCount(seed, oldType, newType, callback){
		var userToUpdate;
		userToUpdate = new User(seed);
		(oldType === "love") ? userToUpdate.love_count-- : userToUpdate.hate_count--;
		(newType === "love") ? userToUpdate.love_count++ : userToUpdate.hate_count++;
		userToUpdate.save(function(docs){
			if(!docs){
				callback && callback();
			}else{
				callback && callback(userToUpdate.dump());
			}
		});
	}

	function decreaseLoveHateCount(seed, type, callback){
		var userToUpdate;
		userToUpdate = new User(seed);
		(type === "love") ? userToUpdate.love_count-- : userToUpdate.hate_count--;
		userToUpdate.save(function(docs){
			if(!docs){
				callback && callback();
			}else{
				callback && callback(userToUpdate.dump());
			}
		});
	}

	function increaseLoveHateCount(seed, type, callback){
		var userToUpdate;
		userToUpdate = new User(seed);
		(type === "love") ? userToUpdate.love_count++ : userToUpdate.hate_count++;
		userToUpdate.save(function(docs){
			if(!docs){
				callback && callback();
			}else{
				callback && callback(userToUpdate.dump());
			}
		});
	}

	function createNewUserWithLoveHateCount(fbId, name, type, callback){
		var newUser, seed;
		seed = {
			name : name,
			fb_id : fbId,
			logged_in : 0
		};

		(type === "love") ? (seed['love_count'] = 1) : (seed['hate_count'] = 1);

		newUser = new User(seed);
		newUser.save(function(docs){
			if(!docs){
				callback && callback();
			}else{
				callback && callback(docs);
			}
		});
	}

	Model.extend(User);

	/*---------------Class Methods--------------------*/

	/*---------------Prototye Methods------------------*/

	return User;
}());