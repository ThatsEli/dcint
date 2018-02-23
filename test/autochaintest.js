var dcint = require('../src/index');

var nodes = [];

for (let i = 0; i < 100; i++) {
    nodes.push({ node: dcint.createNode() });
}

for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].node.setupEncryptionKey('joO4chN1tmsH8cRF0HeprOd2kwf7GDli');
    nodes[i].port = 5000 + i;
    nodes[i].node.initNode(nodes[i].port, function(channel, data, meta) { console.log(nodes[i].port); });
}

nodes[0].node.attachToNodes(['localhost:5001']);

for (let i = 1; i < nodes.length - 1; i++) {
    nodes[i].node.attachToNodes(['localhost:' + nodes[i - 1].port, 'localhost:' + nodes[i + 1].port]);
}

nodes[nodes.length - 2].node.initNode(nodes[nodes.length - 2].port, function(channel, data, meta) { console.log("!!!"); });

console.log(nodes[nodes.length - 2].port);

setTimeout(function() {
    console.time('test');
    console.log("Start:");
    nodes[0].node.emitData('test', { test:true });
}, 500);


