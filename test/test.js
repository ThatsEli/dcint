var dcint = require('../src/index');

var node1 = dcint.createNode();
var node2 = dcint.createNode(); 

node1.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
node2.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

node1.initNode(4000);
node2.initNode(5000);


node1.attachToNodes(['localhost:5000'], function(channel, data, meta) {
    console.log(data);
});

node2.attachToNodes(['localhost:4000'], function(channel, data, meta) {
    console.timeEnd('test');
    console.log(data);
});

setTimeout(function() {
    console.time('test');
    node1.emitData('test', {test1:true});
    node2.emitData('test', {test2:true});
}, 2000);


