var http = require('http');
var fs = require('fs');

/*
 * send interval in millis
 */
var sendInterval = 5000;

function sendServerSendEvent(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var sseId = (new Date()).toLocaleTimeString();

    setInterval(function () {
        writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
    }, sendInterval);

    writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
}

function writeServerSendEvent(res, sseId, data) {
    res.write('id: ' + sseId + '\n');
    res.write("data: new server event " + data + '\n\n');
}

http.createServer(function (req, res) {
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req.url == '/talk') {
            sendServerSendEvent(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end();
    }
}).listen(8080);