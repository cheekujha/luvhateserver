module.exports = function(server){
	var postUser = require("./controllers/postUser.js");
	var updateUser = require("./controllers/updateUser.js");
	var getUser = require("./controllers/getUser.js");
	var postFbRelation = require("./controllers/postFbRelation.js");
	var getFbRelationByUserId = require("./controllers/getFbRelationByUserId.js");
	var postNotificationRelation = require("./controllers/postNotificationRelation.js");
	var NotificationService = require('./services/NotificationService.js');


	server.post('/user', postUser);
	server.post('/user/:userId', updateUser);
	server.get('/user/:userId', getUser);
	server.post('/fbRelation', postFbRelation);
	server.get('/fbRelationForUser/:userId', getFbRelationByUserId);
	server.post('/notificationRelation', postNotificationRelation);
}
