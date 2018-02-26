var dcint = require('../src/index');

var node1 = dcint.createNode(); var node2 = dcint.createNode();

var results = 0;

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var send = 0;

node1.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
node2.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

node1.initNode(4000, ['*'], function() {});
node2.initNode(5000, ['*'], function(channel, data, meta) {
    send++;
    node1.emitData('test', {});
});

node1.attachToNodes(['localhost:5000']);

node2.attachToNodes(['localhost:4000']);

setTimeout(function() {
    node1.emitData('test', {});
}, 10);

var total = 0;

setInterval(function() {
    total += send;
    send = 0;
    results++;
    if(results == 120) { console.log(process.memoryUsage().heapUsed / 1000000 + "MB |" + total / 120);  process.exit(); }
}, 1000);


