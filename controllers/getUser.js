module.exports = (function(){
	var User = require("../models/User.js");
	var FbRelation = require("../models/FbRelation.js");
	var getUser = function(req, res, next){
		// console.log("...got it..",typeof req.body);
		var userId;
		userId = req.params.userId;
		// console.log(',,,,,,,,,,userId,,,,,,,,,,,,,,,',userId);
		User.findById(userId, function(users){
			// console.log(',,,,,,,,,,findById,,,,,,,,,,,,,,,',docs);
			if(users.length > 0){
				var user = users[0];
				FbRelation.findByFromId(user.fb_id, function(relations){
					if(relations && relations.length > 0){
						user.relations = relations;
					}else{
						user.relations = [];
					}
					res.writeHead(200,{
						'Content-Type': 'text/json'
					});
					res.end(JSON.stringify(users));
				});
			}else{
				res.writeHead(204,{
					'Content-Type': 'text/json'
				});
				res.end();
			}
			// res.end();
		});	
	}
	return getUser;
}());