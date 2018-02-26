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

node1.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
node2.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

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

setInterval(function() {
    console.log(  Math.floor(process.uptime()) + " " +  send + "");
    send = 0;
    results++;
    if(results == 300) { process.exit(); }
}, 1000);


