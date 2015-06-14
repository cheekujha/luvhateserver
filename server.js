var restify = require('restify');
var projectName = "luvhate";
var server = restify.createServer();
var routes = require('./router');
var _ = require('underscore');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonBodyParser());
// server.use(restify.bodyParser({ mapParams: false }));

// Add headers
server.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


server.on('uncaughtException',function(request, response, route, error){
  console.error(error.stack);
  response.send(error);
});

routes(server);

server.listen(3434, function(){
	console.log("Server created", server.url);
});


