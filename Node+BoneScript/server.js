var http = require("http");
var b = require("bonescript");
var fs = require("fs");
//var index = fs.readFileSync('index.html');

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    message = { Hello: "World" };
    res.end(JSON.stringify(message));
  })
  .listen(8081);
