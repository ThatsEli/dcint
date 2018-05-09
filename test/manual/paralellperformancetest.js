var dcint = require('../../lib/index');

var node1 = new dcint.Node(4000, ['*'], () => {}); 
var node2 = new dcint.Node(5000, ['*'], (channel, data, meta) => { send++; node1.emitData('test', {}); });

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

node1.attachToNodes(['localhost:5000']);

node2.attachToNodes(['localhost:4000']);

setTimeout(function() {
    for (let i = 0; i < 5000; i++) {
        node1.emitData('test', {});
    }
}, 10);

setInterval(function() {
    console.log(send);
    send = 0;
    results++;
    if(results == 15) { process.exit(); }
}, 1000);


