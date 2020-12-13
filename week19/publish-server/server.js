let http = require('http');
let https = require('https');
// let fs = require('fs');
let unzipper = require('unzipper');
let querystring = require('querystring');

// 2. auth路由：接收code， 用code + client_id + client_secret 换 token
function auth(req, res) {
    let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function (info) {
        console.log(info);
        res.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`);
        res.end();
    });

}

function getToken(code, callback) {
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.d1d27d9bc42c9e1f&client_secret=d13eb53d1062d27faa6b5059d380fac89d532cfb`,
        port: 443,
        method: 'POST',
    }, function (response) {
        let body = '';
        response.on('data', chunk => {
            body += chunk.toString()
        })

        response.on('end', chunk => {
            callback(querystring.parse(body));
        })
    });
    request.end();
}
// 4. publish路由： 用token获取用户信息，检查权限，接收发布
function publish(req, res) {
    let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    
    getUser(query.token, info => {
        if(info.login === 'hyin08') {
            req.pipe(unzipper.Extract({ path: '../server/public/' }));
        }
    });    
}

function getUser(token, callback) {
    let request = https.request({
        hostname: 'api.github.com',
        path: `/user`,
        port: 443,
        method: 'GET',
        headers: { 
            Authorization: `token ${token}`,
            "User-Agent": 'toy-publish'
        }
    }, function (response) {
        let body = '';
        response.on('data', chunk => {
            body += chunk.toString()
        })

        response.on('end', chunk => {
            callback(JSON.parse(body));
        })
    });
    request.end();
}



http.createServer(function (req, res) {

    if (req.url.match(/^\/auth\?/))
        return auth(req, res);
    if (req.url.match(/^\/publish\?/))
        return publish(req, res);
    // let outFile = fs.createWriteStream("../server/public/file.zip")

    // req.pipe(outFile);

    // req.pipe(unzipper.Extract({ path: '../server/public/' }));

}).listen(8082)