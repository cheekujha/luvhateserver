module.exports = (function(){
	var User = require("../models/User.js");
	var postUsers = function(req, res, next){
		// console.log("...got it..");
		var newUser, fbId;
		fbId = req.body.fb_id;

		User.findByFbId(fbId, function(docs){
			if(docs.length > 0){
				var userToUpdate = new User(docs[0]);
				var updateParams = req.body;
				var response;
				for(item in updateParams){
					userToUpdate[item] = updateParams[item];
				};
				userToUpdate.save(function(saved){
					if(!saved){
						res.writeHead(400,{
							'Content-Type': 'text/json'
						});
						res.end(JSON.stringify(userToUpdate.errors));
					}else{
						response = userToUpdate.dump();
						res.writeHead(200,{
							'Content-Type': 'text/json'
						});
						
						res.end(JSON.stringify(response));
					}
				});
				
			}else{
				var newUser = new User(req.body);
				// console.log("...got it..aafter",newUser);
				if(newUser.isInValid){
					res.writeHead(400,{
						'Content-Type': 'text/json'
					});
					res.end(JSON.stringify(newUser.errors));
				}else{
					newUser.save(function(docs){
						// console.log("......ended..callback....",docs);
						if(!docs){
							res.writeHead(400,{
								'Content-Type': 'text/json'
							});
							res.end();
						}else{
							res.writeHead(200,{
								'Content-Type': 'text/json'
							});
							res.end(JSON.stringify(docs));
						}
					});
				}
			}
		});	
	}
	return postUsers;
}());