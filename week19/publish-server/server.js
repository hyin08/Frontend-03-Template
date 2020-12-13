let http = require('http');
// let fs = require('fs');
let unzipper = require('unzipper');

http.createServer(function(req, res) {
    console.log(req.headers);

    // let outFile = fs.createWriteStream("../server/public/file.zip")

    // req.pipe(outFile);

    req.pipe(unzipper.Extract({ path: '../server/public/' }));

}).listen(8082)