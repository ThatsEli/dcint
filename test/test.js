var dcint = require('../src/index'); // require dcint

var node1 = dcint.createNode(); var node2 = dcint.createNode(); // instanciate the first and 2nd node

node1.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli"); // set the same encryption key for both
node2.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli"); // set the same encryption key for both

node1.initNode(4000); // initiate the node's server
node2.initNode(5000); // initiate the node's server

node1.attachToNodes(['localhost:5000'], function(channel, data, meta) {});// attach to the 2nd node

node2.attachToNodes(['localhost:4000'], function(channel, data, meta) { // attach to the first node, stop the timer and log incomming data
    console.log(data);
});

setTimeout(function() {
    node1.emitData('test', {test1:true}); // emit data to all connected nodes, node 2 in this case
}, 2000);


