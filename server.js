var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
  switch (req.url) {
    case '/bundle.js':
      res.setHeader('content-type', 'application/javascript')
      fs.createReadStream('bundle.js').pipe(res)
    break;
    default:
      res.setHeader('content-type', 'text/html')
      fs.createReadStream('index.html').pipe(res)
  }
}).listen(4000)
