var dcint = require('../../lib');

var node1 = new dcint.Node(4000, ['*'], () => {}); 
var node2 = new dcint.Node(5000, ['*'], (channel, data, meta) => {
    send++;
    node1.emitData('test', {});
});

var results = 0;

var send = 0;

node1.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
node2.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

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


