// generated by @ng-toolkit/universal
const port = process.env.PORT || 4000;
const server = require('./dist/server');
var fs = require('fs'), 
 https = require('https');
/*var options  = { 
 key: fs.readFileSync('/etc/letsencrypt/live/hasquiz.com/privkey.pem'),
 cert: fs.readFileSync('/etc/letsencrypt/live/hasquiz.com/fullchain.pem')
};*/
var options=null;

var httpsServer = https.createServer(options, server.app)
 .listen(port, () => {
  console.log("Express server listening on port " + port);
 });