const dcint = require('../src/index');

var startNode = dcint.createNode();
var firstMiddleNode = dcint.createNode();
var secondMiddleNode = dcint.createNode();
var endNode = dcint.createNode();

startNode.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
firstMiddleNode.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
secondMiddleNode.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
endNode.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

startNode.initNode(4000);
firstMiddleNode.initNode(5000);
secondMiddleNode.initNode(5500);
endNode.initNode(6000);

startNode.attachToNodes(['localhost:5000'], function() {});
firstMiddleNode.attachToNodes(['localhost:4000','localhost:5500'], function() {});
secondMiddleNode.attachToNodes(['localhost:5000','localhost:6000'], function() {});

endNode.attachToNodes(['localhost:5000'], function(channel, data, meta) {
    console.timeEnd('chaintest')
    console.log(data);
});

setTimeout(function() {
    console.time('chaintest');
    startNode.emitData('test', {test:true});
}, 1500);