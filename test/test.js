var dcint = require('../src/index');

var node1 = dcint.createNode();

var node2 = dcint.createNode(); 

node1.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

// node2.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

node1.initNode(4000);

node2.initNode(5000);


node1.attachToNodes(['localhost:5000'], function(data) {
    console.log(data);
});

node2.attachToNodes(['localhost:4000'], function(data) {
    console.log(data);
});

setTimeout(function() {
    console.log("Node1: " + node1.getConnectedNodes());
    console.log("Node2: " + node2.getConnectedNodes());
}, 500);

setTimeout(function() {
    node1.emitData({test1:true});
    node2.emitData({test2:true});
}, 2000);


