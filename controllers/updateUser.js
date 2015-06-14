module.exports = (function(){
	var User = require("../models/User.js");
	var updateUser = function(req, res, next){
		// console.log("...got it..",typeof req.body);
		var userId, updateParams;
		userId = req.params.userId;
		updateParams = req.body;
		console.log(',,,,,,,,,,userId,,,,,,,,,,,,,,,',userId);
		
		User.findById(userId, function(docs){
			// console.log(',,,,,,,,,,findById,,,,,,,,,,,,,,,',docs);
			var i,l, param;
			if(docs.length > 0){
				// for(i=0,l=docs.length; i<l; i=i+1){
				var currentUser = new User(docs[0]);
				for(param in updateParams){
					currentUser[param] = updateParams[param];
				}
				currentUser.save(function(docs){
					if(!docs){
						res.writeHead(400,{
							'Content-Type': 'text/json'
						});
						res.end();
					}else{
						res.writeHead(200,{
							'Content-Type': 'text/json'
						});
						res.end(JSON.stringify(currentUser.dump()));
					}
				});
				// }
			}else{
				res.writeHead(400,{
					'Content-Type': 'text/json'
				});
				res.end();
			}
		});	
	}
	return updateUser;
}());