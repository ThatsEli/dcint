# dcinTransfer
### **D**e**C**entralized**I**nter**N**ode**T**ransfer

## Table of contents
+ node
	+ [setEncryptionKey(key)](#setencryptionkeykey)
	+ [attachToNodes(nodes)](#attachtonodesnodes)
	+ [getConnectedNodes()](#getconnectednodes)
	+ [emitData(channel, data)](#emitdatachannel-data)


# dcint

dcint can be required as an npm module
```js
const dcint = require('dcint');
```

# class: node

## Create a new node

You can create a new node with the arguments:

* port: number          (port for the node to listen on)
* subscribedChannels: Array<String>          (array of channels to subscribe to,use ['*'] to subscribe to any channel)
* callback: Function         (function to be called when ready)

## setEncryptionKey(key)
```js
node.setEncryptionKey(key)
```
**Description**: 
Sets the key used for encryption by the node

**Arguments**:
+ key: string: | define the key that should be used for encryption, must be !**32 chars**!

**Returns**: void

**Example**:
```js
node.setupEncryptionKey('joO4chN1tmsH8cRF0HeprOd2kwf7GDli')
```

## attachToNodes(nodes)
```js
node.attachToNodes(nodes)
```
**Description**: 
The node connect to the new nodes

**Arguments**:
+ nodesArray: Array<String> | nodes to attach to, use ['*'] to subscribe to all channels

**Returns**: void

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
+ Array<Node>: array that includes nodes which the current ndoe is connected to

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
+ channel: string | channel to emit to
+ data: object| data to emit

**Returns**: void

**Example**:
```js
node.emitData('news', { test:true })
```

