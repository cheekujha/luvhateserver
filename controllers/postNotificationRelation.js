module.exports = (function(){
	var NotificationRelation = require("../models/NotificationRelation.js");

	var postNotificationRelation = function(req, res, next){
		var userId, registrationId;
		userId = req.body.user_id;
		registrationId = req.body.registration_id;
		NotificationRelation.findByRegistrationId(registrationId, function(docs){
			if(docs && docs.length > 0){
				var savedRelation = new NotificationRelation(docs[0]), response;

				if(savedRelation.user_id != userId){
					savedRelation.user_id = userId;
					savedRelation.save(function(saved){
						if(!saved){
							res.writeHead(400,{
								'Content-Type': 'text/json'
							});
							res.end(JSON.stringify(savedRelation.errors));
						}else{
							response = savedRelation.dump();
							res.writeHead(200,{
								'Content-Type': 'text/json'
							});
							
							res.end(JSON.stringify(response));
						}
					});
				}else{
					response = savedRelation.dump();
					res.writeHead(200,{
						'Content-Type': 'text/json'
					});
					res.end(JSON.stringify(response));
				}
			}else{
				var newRelation = new NotificationRelation(req.body);
				if(newRelation.isInValid){
					res.writeHead(400,{
						'Content-Type': 'text/json'
					});
					res.end(JSON.stringify(newRelation.errors));
				}else{
					newRelation.save(function(docs){
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

	return postNotificationRelation;
}());