module.exports = (function(){
	var User = require("../models/User.js");
	var FbRelation = require("../models/FbRelation.js");
	

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
	return postFbRelation;
}());