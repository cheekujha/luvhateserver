module.exports = (function(){
	var FbRelation = require("../models/FbRelation.js");
	var getFbRelationForUserId = function(req, res, next){
		// console.log("...got it..",typeof req.body);
		var userId;
		userId = req.params.userId;
		// console.log(',,,,,,,,,,userId,,,,,,,,,,,,,,,',userId);
		FbRelation.findByFromId(userId, function(docs){
			// console.log(',,,,,,,,,,findById,,,,,,,,,,,,,,,',docs);
			if(!docs){
				res.writeHead(400,{
					'Content-Type': 'text/json'
				});
				res.end(JSON.stringify({message : "DB Error"}));
			}
			if(docs.length > 0){
				res.writeHead(200,{
					'Content-Type': 'text/json'
				});
				res.end(JSON.stringify(docs));
			}else{
				res.writeHead(204,{
					'Content-Type': 'text/json'
				});
				res.end();
			}
			res.end();
		});	
	}
	return getFbRelationForUserId;
}());