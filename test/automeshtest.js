var dcint = require('../src/index');

var nodes = [];

for (let i = 0; i < 100; i++) {
    nodes.push({ node: dcint.createNode() });
}

for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].node.setupEncryptionKey('joO4chN1tmsH8cRF0HeprOd2kwf7GDli');
    nodes[i].port = 5000 + i;
    nodes[i].node.initNode(nodes[i].port, function() {} );
}

nodes[i].node.setupEncryptionKey('joO4chN1tmsH8cRF0HeprOd2kwf7GDli');
nodes[nodes.length - 1].node.initNode(5000 + (nodes.length - 1), function() { console.log("x"); } );
console.log("x" + (5000 + (nodes.length - 1)));

nodes[0].node.attachToNodes(['localhost:5001']);

for (let i = 1; i < nodes.length - 1; i++) {

    var peerNodes = [];

    for (let x = 0; x < 5; x++) {
        peerNodes.push( 'localhost:' + nodes[ Math.floor( Math.random() * nodes.length ) ].port );
    }

    nodes[i].node.attachToNodes(peerNodes);
    
}

nodes[nodes.length - 1].node.attachToNodes(['localhost:' + nodes[nodes.length - 2].port]);

setTimeout(function() {
    // console.time('test');
    console.log("Start:");
    nodes[50].node.emitData('test', { test:true });
}, 1000);


