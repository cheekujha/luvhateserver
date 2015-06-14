// var mongoClient = require('mongodb').MongoClient;
// var projectName = "demo";

// //Connection start
// var url = 'mongodb://localhost:27017/'+projectName;
// // Use connect method to connect to the Server
// mongoClient.connect(url, function(err, db) {
//   // assert.equal(null, err);
//   console.log("Connected correctly to server");

//   db.close();
// });
var projectName = "PR";
var mongojs = require('mongojs');
var db = mongojs(projectName);

/*--------------Reviews Collecyion----------------*/
var reviewsCollection = db.createCollection("reviews");
reviewsCollection.ensureIndex({'location.position':'2dsphere'});

