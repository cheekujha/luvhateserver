module.exports = (function(){
	var FbRelation = require("../models/FbRelation.js");
	var getFbRelation = function(req, res, next){
		// console.log("...got it..",typeof req.body);
		var realtionId;
		realtionId = req.params.realtionId;
		// console.log(',,,,,,,,,,realtionId,,,,,,,,,,,,,,,',realtionId);
		FbRelation.findById(realtionId, function(docs){
			// console.log(',,,,,,,,,,findById,,,,,,,,,,,,,,,',docs);
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
	return getFbRelation;
}());