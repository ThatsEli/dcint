var dcint = require('../src/index');

var nodes = [];

for (let i = 0; i < 100; i++) {
    nodes.push({ node: dcint.createNode() });
}

for (let i = 0; i < nodes.length; i++) {
    nodes[i].node.setupEncryptionKey('joO4chN1tmsH8cRF0HeprOd2kwf7GDli');
    nodes[i].port = 5000 + i;
    nodes[i].node.initNode(nodes[i].port);
}

nodes[0].node.attachToNodes(['localhost:5001'], function(data) {});

for (let i = 1; i < nodes.length - 1; i++) {
    nodes[i].node.attachToNodes(['localhost:' + nodes[i - 1].port, 'localhost:' + nodes[i + 1].port], function(channel, data, meta) {})
}

nodes[nodes.length - 1].node.attachToNodes(['localhost:' + nodes[nodes.length - 2].port], function(channel, data, meta) { console.timeEnd('test'); console.log(data); });

setTimeout(function() {
    console.time('test');
    nodes[0].node.emitData('test', { test:true });
}, 5000);


