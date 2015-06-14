// var database = require("database.js");

module.exports = (function(){
	// var Database = require("./Model.js");
	var mongojs = require('mongojs');
	var Database = {};
	var projectName = "luvhate";
	Database.db = mongojs(projectName);

	Database.insert = function(collectionName, data, callback){
		var collection = Database.db.collection(collectionName);
		// console.log("....options......",options);
		collection.save(data, function(err, docs){
			if(err){
				console.log("error fully");
				callback && callback(null);
			}else{
				console.log("saved fully", docs);
				callback && callback(docs);
			}
		});
	};

	Database.find = function(collectionName, options, callback){
		// var queryObj = Database.makeQueryObj(collectionName, options);
		options = options ? options : {};
		options['method'] = 'findOne';
		Database.exec(collectionName, options, callback);
	};

	Database.findAll = function(collectionName, options, callback){
		options = options ? options : {};
		options['method'] = 'find';
		Database.exec(collectionName, options, callback);
	};

	Database.findAndGroup = function(collectionName, options, callback){
		// console.log('3');
		options = options ? options : {};
		options['method'] = 'group';
		Database.exec(collectionName, options, callback);
	}

	Database.update = function(collectionName, options, callback){
		options = options ? options : {};
		// options.projection = options.set ? options.set : {};
		options['method'] = 'update';

		var successFunc = function(){
			// console.log('5');
			if(callback){
				callback.apply(this, arguments);
			}
		};

		var errorFunc = function(){
			if(callback){
				callback.apply(this, arguments)
			}
		};
 
		collection = Database.db.collection(collectionName);

		collection.update(options.where, options.set, function(err, lastErrorObj){
			if(err){
				errorFunc && errorFunc();
			}else{
				successFunc && successFunc(lastErrorObj);
			}
		});
		// Database.exec(collectionName, options, callback);
	}

	Database.findAndModify = function(collectionName, options, callback){
		options = options ? options : {};
		options['method'] = 'findAndModify';
		Database.exec(collectionName, options, callback);
	}

	/*
	**@options : include, remove, where
	**/
	Database.makeQueryObj = function(collectionName, options){
		//make criteria, projection
		var criteriaStr = '{', where;

		where = options['where'] ? options['where'] : [];
		where.map(function(cond){
			for(var key in cond){
				if(toString.call(cond[key]) === "[object Object]"){
					criteriaStr = criteriaStr + ' "' + key + '" : ' + JSON.stringify(cond[key]) + ',';
				}else{
					criteriaStr = criteriaStr + ' "' + key + '" : ' + cond[key] + ',';
				}
			}
		});
		if(where.length > 0){
			criteriaStr = criteriaStr.substring(0, criteriaStr.length -1);
		}
		criteriaStr = criteriaStr + '}';
		// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",criteriaStr);
		// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",JSON.parse(criteriaStr));

	};

	Database.exec = function(collectionName, options, callback){
		// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",options);
		// console.log('4');
		var projection, method, criteria, collection;
		method = options.method;
		criteria = options.where ? options.where : {};
		projection = options.select ? options.select : {};

		var successFunc = function(){
			// console.log('5');
			if(callback){
				callback.apply(this, arguments);
			}
		};

		var errorFunc = function(){
			if(callback){
				callback.apply(this, arguments)
			}
		};
 
		collection = Database.db.collection(collectionName);
		// console.log('6',collection[method]);
		// console.log('7',criteria);
		// criteria = {key:{'location.position':true}, initial : {arr:[]} ,reduce: function(doc, prev){return prev.arr.push(doc)}, query:{"location.position":{"$nearSphere":{"$geometry":{"type":"Point","coordinates":[77.595644,12.888234]},"$maxDistance":0.2}}}},{}
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",criteria, projection);
		if(method === 'group' ){
			collection[method](criteria, function(err, docs){
				if(err){
					// errorFunc && errorFunc(err);
					errorFunc && errorFunc();
				}else{
					successFunc && successFunc(docs);
				}
			});
		}else{
			collection[method](criteria, projection, function(err, docs){
				if(err){
					errorFunc && errorFunc();
				}else{

					successFunc && successFunc(docs);
				}
			});
		}
	};

	return Database;
}());