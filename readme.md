# dcinTransfer

### **D**e**C**entralized**I**nter**N**ode**T**ransfer

## Whats is this?

You can use this module to send data between nodes. It has special "feautures" like decentralization and strong encryption.

Small disclaimer: This is my first npm module :)

## Features

* uses only one external module: socket.io
* strong encryption
* decentralization AND direct communication
* fast prcessing time

## Simple usage / example

```js
var dcint = require('dcint'); // require dcint

var node1 = dcint.createNode(); var node2 = dcint.createNode(); // instanciate the first and 2nd node

node1.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli"); // set the same encryption key for both
node2.setupEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli"); // set the same encryption key for both

node1.initNode(4000, ['*'], function() {}); // initiate the node
node2.initNode(5000, ['*'], function(channel, data, meta) {// initiate the node and attach a callback
    console.log(channel + "|" + data);                     // that logs the recieved message
});

node1.attachToNodes(['localhost:5000']); // attach to the 2nd node

node2.attachToNodes(['localhost:4000']); // attach to the 1st node

setTimeout(function() {
    node1.emitData('test', {test1:true}); // emit data to all connected nodes, node 2 in this case
}, 500);



```
## Performance

A DCINT node can process around 725 messages per second (tested on a 3.5 Ghz core (i5-6600K)).

### History:

+ The first(Before rewrite) version of DCINT could process around 100 messages/second but dropped quickly to 0 or 1
+ The second(Not optimized) and third(Optimized) version both performed at around 700 message/second but started dropping after 40 seconds. Both versions also used an imense amount of memory and CPU(maxed out the active core) after some time!
+ The fourth and current version stays stable at 725 message/second average while using 30MB RAM and 4% CPU(4 threads) (After RAM optimization)


![alt text](https://i.imgur.com/gvWmKuS.png "Comparison")


## Installation

```bash
npm install dcint
```