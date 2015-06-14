// var database = require("database.js");

module.exports = (function(){
	var Base = require("./Base.js");
	var database = require("../db/database.js");
	var stringHelper = require("../helpers/string.js");
	var util = require("../helpers/utility.js");
	// console.log(".....",util);
	function Model(){

	}

	Base.extend(Model);

	Model.extend = function(sub_class) {
		Base.extend.call(this, sub_class);
		sub_class.setDefaultColumns(sub_class);
		if(sub_class._finders){
			prepareFinders(sub_class);
		}
	};

	Model.setDefaultColumns = function(){
		var column_names = this._column_names, i, l, defaults={};
		for(i=0,l=column_names.length ; i<l ;i++){
			var column_info = column_names[i];
			if(column_info['default']!== undefined){
				defaults[column_info['name']] = column_info['default']; 
			}
		}
		this._defaults = defaults;
	}

	Model.create = function(instance, callback){
		instance.created_at = Date.now();
		instance.updated_at = Date.now();
		var collectionName = this._collection_name;
		var insert_data;
		// var columns = this._column_names;
		instance.id = uuid();
		insert_data = instance.dump();
		database.insert(collectionName, insert_data, callback);
	}

	Model.update = function(options, callback){
		// var id = obj.id;
		var collectionName = this._collection_name;
		database.update(collectionName, options, callback);
	}

	Model.findAll = function(options, callback){
		// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",JSON.stringify(options));
		var collectionName = this._collection_name;
		database.findAll(collectionName, options, callback);
	}

	Model.find = function(id, callback){
		var collectionName = this._collection_name;
		var options = {
			where : {}
 		};

 		options['where'][this.primaryKey()] = id;
		database.findAll(collectionName, options, callback)
	}

	Model.findAndGroup = function(options, callback){
		console.log('2');
		var collectionName = this._collection_name;
		database.findAndGroup(collectionName, options, callback);	
	}

	/*---------------Class Methods--------------------*/

	Model.primaryKey = function() {
		return this._primary_key === undefined ? "id" : this._primary_key;
	};

	/*---------------Prototye Methods------------------*/
	Model.prototype.init = function(seed){
		seed = seed || {};
		// this.column_names = this._klass._column_names;
		// this.collection_name = this._klass._collection_name;
		this.save_in_db = this._klass._save_in_db;
		var attrs = this._klass._column_names;
		// console.log('.......primaryKey........',seed[this._klass.primaryKey()]);
		if(seed[this._klass.primaryKey()] === undefined) {
			//new object in memory
			seed = setDefaults(seed, this._klass._defaults);
		}
		if (attrs) {
			// console.log('.......here........', attrs);
			// console.log('...........seed............',seed);
			createAttributes(this, attrs.slice(), seed);
		}
	}

	Model.prototype.newRecord = function() {
		return (this.id === undefined || this.id === null) ? true : false;
	};

	Model.prototype.save = function(callback){
		if(this.newRecord()){
			this._klass.create(this, callback);
		}else{
			this.update(callback);
		}		
	}

	Model.prototype.dump = function() {
		// console.log(">>>>>>>>>>>>>>>DUMp>>>>>>>>>>>>>>>",this._klass._column_names);
		var dump = {};
		// var columns = this.column_names;
		var columns = this._klass._column_names;
		if (columns) {
			for (var i = 0; i < columns.length; i++) {
				dump[columns[i]['name']] = this[columns[i]['name']];
			}
		}
		// console.log(">>>>>>>>>>>>>>>>>>>>DUMP>>>>>>>>>>>>>>>>>>>",dump);
		return dump;
	};

	Model.prototype.update = function(callback) {
		updateModel(this, this.dump(), callback);
		// updateModel(this, updateParams, callback);
	};

	/*--------------------private functions------------*/

	function updateModel(obj, set, callback) {
		// if(obj.column_names.indexOf('updated_at') >= 0) {
		// obj.updated_at = $.date.now();
		set.updated_at = Date.now();
		// }

		// set = fillEmptyWithNull(set, obj._column_names);

		var setOptions = {
			set : set,
			where : {id: obj.id}
		};

		database.update(obj._klass._collection_name, setOptions, callback);
	}


	function setDefaults(obj, default_values) {
		for(var column in default_values) {
			if(default_values.hasOwnProperty(column)) {
				if(obj[column] === undefined) {
					obj[column] = default_values[column];
				}
			}
		}
		return obj;
	}

	uuid = function() {
		var rfc4_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
    });
    return rfc4_id.replace(/-/g, "").toUpperCase();
	}

	function createAttributes(instance, attrs, seed){
		if(attrs.length === 0){
			return
		}
		var currentAttr = attrs.shift();
		createAttribute(instance, currentAttr, seed, attrs);
	}

	function createAttribute(instance, attr, seed, attrs){
		// console.log(".......seed...........",seed);
		var name = attr.name;
		var type = attr.type;

		// console.log("..................",name,".....................",seed[name]);
		// console.log(".......seed.......after....",seed);
		var val = seed[name];
		var defaultVal = attr['default'];
		if(type.charAtIsUpperCase(0)){
			var instanceFile = require('./' + type + '.js');
			var newInstance = new instanceFile(val);
			if(newInstance.save_in_db){
				var primaryKey = newInstance._klass.primaryKey();
				if(newInstance[primaryKey] === undefined){
					newInstance.save(function(docs){
						instance[name] = docs[0][newInstance._klass.primaryKey()];
						createAttributes(instance, attrs, seed);	
					});
				}else{
					newInstance._klass.find(primaryKey);
				}
			}else{
				var aa = newInstance.dump();
				instance[name] = aa;
				createAttributes(instance, attrs, seed);
			}
		}else{
			instance[name] = validations[attr.type](val) ? val : (defaultVal ? defaultVal : null);
			if(attr.required){
				if(instance[name] === null){
					instance['isInValid'] = true;
					instance['errors'] = instance['errors'] ? instance['errors'] : [];
					instance['errors'].push(name + ' is missing');
				}
			}
			// instance[name] = val;
			// console.log("..................",name,".....................",instance[name]);
			createAttributes(instance, attrs, seed);
		}
		
	}

	function prepareFinders(sub_class){
		var keys = sub_class._finders;
		if(finders && finders.length > 0){

		}else{
			return;
		}
	}

	var validations = {
		"string" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"integer" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"boolean" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"uuid" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"float" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"dateTime" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"date" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"money" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"array" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		},
		"email" : function(val){
			if(util.isUndefined(val)){
				return false;
			}
			return true;
		}
	}

	return Model;
}());