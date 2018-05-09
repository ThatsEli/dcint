"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypt_1 = require("../tools/crypt");
var strings_1 = require("../tools/strings");
var object_hash_1 = __importDefault(require("object-hash"));
var Node = /** @class */ (function () {
    function Node(port, subscribedChannels, callback) {
        var _this = this;
        this.bufferSize = 500;
        this.server = require('socket.io')();
        this.server.listen(port);
        this.key = strings_1.stringsTools.randomString(32);
        this.nodes = [];
        this.server.on('connection', function (socket) {
            var receivedMessages = [];
            socket.on('data', function (crypt) {
                if (crypt == undefined) {
                    return;
                }
                if (crypt.id == undefined) {
                    return;
                }
                if (crypt.data == undefined) {
                    return;
                }
                if (crypt.channel == undefined) {
                    return;
                }
                if (crypt.forwardings == undefined) {
                    return;
                }
                var included = false;
                included = receivedMessages.some(function (m) { return m.id === crypt.id; });
                if (!included) {
                    // @ts-ignore
                    if (subscribedChannels.includes(crypt.channel) || subscribedChannels.length == 0 || subscribedChannels[0] == '*') {
                        try {
                            if (crypt.id == object_hash_1.default(crypt.data)) {
                                callback(crypt.channel, JSON.parse(crypt_1.cryptTools.decrypt(crypt.data, _this.key)).content, {
                                    forwardings: crypt.forwardings
                                });
                            }
                        }
                        catch (error) {
                            return;
                        }
                    }
                    crypt.forwardings = ++crypt.forwardings;
                    receivedMessages.push(crypt);
                    for (var i = 0; i < _this.nodes.length; i++) {
                        _this.nodes[i].socket.emit('data', crypt);
                    }
                    //better but slower, uses more cpu and memory
                    // setTimeout(function() {
                    //     receivedMessages.shift();
                    // }, 1000 * 10  );
                    //worse but is fast and more efficient
                    if (receivedMessages.length === _this.bufferSize) {
                        receivedMessages.shift();
                    }
                }
            });
        });
    }
    Node.prototype.setEncryptionKey = function (newKey) {
        this.key = newKey;
    };
    Node.prototype.attachToNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            this.nodes.push({
                host: 'ws://' + node,
                socket: require('socket.io-client')('ws://' + node)
            });
        }
    };
    Node.prototype.getConnectedNodes = function () {
        var connectedNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            connectedNodes.push(this.nodes[i].host);
        }
        return connectedNodes;
    };
    Node.prototype.emitData = function (channel, data) {
        var dataObj = {
            data: crypt_1.cryptTools.encrypt(JSON.stringify({
                content: data,
            }), this.key),
            id: '',
            channel: channel,
            forwardings: 0
        };
        dataObj.id = object_hash_1.default(dataObj.data);
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].socket.emit('data', dataObj);
        }
    };
    return Node;
}());
exports.Node = Node;
