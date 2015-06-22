var paragraph = require("./paragraph");
var http = require("http");

function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("hello world");
  response.end();
}

http.createServer(onRequest).listen(8888);
console.log('server started')
