var dcint = require('../src/index'); // require dcint

var node1 = dcint.createNode(); var node2 = dcint.createNode(); // instanciate the first and 2nd node

node1.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli"); // set the same encryption key for both
node2.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli"); // set the same encryption key for both

node1.initNode(4000, ['*'], function() {});
node2.initNode(5000, ['*'], function(channel, data, meta) {
    console.log(channel + "|" + data);
});

node1.attachToNodes(['localhost:5000']);

node2.attachToNodes(['localhost:4000']);

setTimeout(function() {
    node1.emitData('test', {test1:true}); // emit data to all connected nodes, node 2 in this case
}, 500);


