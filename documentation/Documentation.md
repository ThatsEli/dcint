# dcinTransfer
### **D**e**C**entralized**I**nter**N**ode**T**ransfer

## Table of contents
+ dcint
	+ createNode()
+ node
	+ [setEncryptionKey(key)](#setencryptionkeykey)
	+ [initnode(port, channelFilter, callback)](#initnodeport-channelfilter-callback)
	+ [attachToNodes(nodes)](#attachtonodesnodes)
	+ [getConnectedNodes()](#getconnectednodes)
	+ [emitData(channel, data)](#emitdatachannel-data)


# dcint

dcint can be required as an npm module
```js
const dcint = require('dcint');
```

# object: node

## setEncryptionKey(key)
```js
node.setEncryptionKey(key)
```
**Description**: 
Sets the key used for encryption by the node

**Arguments**:
+ key(string): define the key that should be used for encryption, must be !**32 chars**

**Returns**: undefined

**Example**:
```js
node.setupEncryptionKey('joO4chN1tmsH8cRF0HeprOd2kwf7GDli')
```

##  initnode(port, channelFilter, callback)
```js
node.initnode(port, channelFilter, callback)
```
**Description**: 
Initiates the node: listens on port, filters its messages with the given filter and calls the callback on data

**Arguments**:
+ port(number): port for the node to listen on
+ channelFilter(array): array with filters, see channelFilter
+ callback(function): function to be called on incommign data with the arguments [channel, data, meta]

**Returns**: undefined

**Example**:
```js
node2.initNode(5000, ['*'], function(channel, data, meta) {
    console.log(channel + ":" + data);
});
```

## attachToNodes(nodes)
```js
node.attachToNodes(nodes)
```
**Description**: 
The node connect to the new nodes

**Arguments**:
+ nodesArray(array): nodes to attach to

**Returns**: undefined

**Example**:
```js
node.attachToNodes(['localhost:5000']);
```

## getConnectedNodes()
```js
node.getConnectedNodes()
```
**Description**: 
Returns an array with the currently connected nodes

**Arguments**:
/

**Returns**: 
+ nodes(array): array that includes nodes to which the current ndoe is connected to

**Example**:
```js
node.getConnectedNodes()
```

## emitData(channel, data)
```js
node.emitData(channel, data)
```
**Description**: 
Emits data to all other nodes in the network

**Arguments**:
+ channel(string): channel to emit to
+ data(object): data to emit

**Returns**: undefined

**Example**:
```js
node.emitData('news', { test:true })
```

