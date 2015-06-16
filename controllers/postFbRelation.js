module.exports = (function(){
	var User = require("../models/User.js");
	var FbRelation = require("../models/FbRelation.js");
	var NotificationRelation = require("../models/NotificationRelation.js");
	var NotificationService = require("../services/NotificationService.js");
	var gcm = require('node-gcm');
	

	function updateFbRelation(seed, updateParams, callback){
		var fbRelationToUpdate = new FbRelation(seed), item;

		if(fbRelationToUpdate.type != updateParams.type){
			var oldType = fbRelationToUpdate.type;
			var newType = updateParams.type;
			for(item in updateParams){
				fbRelationToUpdate[item] = updateParams[item];
			};

			fbRelationToUpdate.save(function(fbRelation){
				if(!fbRelation){
					callback && callback();
				}else{
					User.updateLoveHateCount(seed.receiver_id, seed.receiver_name, oldType, newType ,function(user){
						if(!user){
							callback && callback();
						}else{
							console.log(">................................",fbRelationToUpdate.dump());
							callback && callback(fbRelationToUpdate.dump());
						}
					});
					// callback && callback(fbRelationToUpdate.dump());
				}
			});	
		}else{
			callback && callback(fbRelationToUpdate.dump());
		}
			
	}

	var postFbRelation = function(req, res, next){
		// console.log("...got it..");
		var newFbRelation, fromId, receiverId;
		fromId = req.body.from_id;
		receiverId = req.body.receiver_id;
		FbRelation.findByFromIdAndReceiverId(fromId, receiverId, function(docs){
			if(!docs){
				res.writeHead(400,{
					'Content-Type': 'text/json'
				});
				res.end(JSON.stringify({message : "DB error"}));
			}
			if(docs.length > 0){
				// var fbRelationToUpdate = docs[0];
				updateFbRelation(docs[0], req.body, function(fbRelation){
					if(!fbRelation){
						res.writeHead(400,{
							'Content-Type': 'text/json'
						});
						res.end(JSON.stringify({message : "DB error"}));
					}else{
						res.writeHead(200,{
							'Content-Type': 'text/json'
						});
						//console.log("****************************************************************");
						sendPushNotification(fbRelation);
						res.end(JSON.stringify(fbRelation));
					}
				});
				
			}else{
				var newFbRelation = new FbRelation(req.body);
				// console.log("...got it..aafter",newFbRelation);
				if(newFbRelation.isInValid){
					res.writeHead(400,{
						'Content-Type': 'text/json'
					});
					res.end(JSON.stringify(newFbRelation.errors));
				}else{
					newFbRelation.save(function(fbRelation){
						// console.log("......fbRelation..callback....",fbRelation);
						if(!fbRelation){
							res.writeHead(400,{
								'Content-Type': 'text/json'
							});
							res.end({message : "DB Error"});
						}else{
							User.addLoveHateCount(receiverId, fbRelation.receiver_name ,fbRelation.type, function(docs){
								if(!docs){
									res.writeHead(400,{
										'Content-Type': 'text/json'
									});
									res.end({message : "DB Error"});
								}else{
									sendPushNotification(fbRelation);
									res.writeHead(200,{
										'Content-Type': 'text/json'
									});
									res.end(JSON.stringify(fbRelation));
								};
							});
						}
					});
				}
			}
		});	
	}

	function sendPushNotification(relation){
		var receiverId = relation.receiver_id;
		// console.log("..............................",receiverId);
		NotificationRelation.findByUserId(receiverId, function(docs){
			// console.log("...........................",docs);
			if(docs && docs.length > 0){
				var i,l, registrationIdsArray = [];
				for(i=0,l=docs.length; i<l; i=i+1){
					registrationIdsArray.push(docs[i]["registration_id"]);
					// var aa = docs[i]["registration_id"];
					// NotificationService.sendNotification(aa, sendNotificationCallback);
				}
				if(registrationIdsArray.length > 0){
					NotificationService.sendNotification(registrationIdsArray, sendNotificationCallback);
				}
			}else{
				return;
			}
		});

	}


	function sendNotificationCallback(success, deleteEntries, results, receiverIdArray){
		if(deleteEntries && results && results.length > 0){
			var i,l = results.length;
			for(i=0; i<l; i=i+1){
				var idToDelete = results[i]['registration_id'];
				console.log(">>>>>>>>>>>>>>ID to DELETE>>>>>>>>>>>>>>>>>>",receiverIdArray[i]);
				if(idToDelete){
					NotificationRelation.deleteRows({where : {'registration_id' : receiverIdArray[i]}}, function(){
						// NotificationService.sendNotification([idToDelete], sendNotificationCallback);
					});
				}
				
			}
		}
	}


	return postFbRelation;
}());
