"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypt_1 = require("../tools/crypt");
var strings_1 = require("../tools/strings");
var Node = /** @class */ (function () {
    function Node(port, subscribedChannels, callback) {
        var _this = this;
        this.server = require('socket.io')();
        this.server.listen(port);
        this.key = strings_1.stringsTools.randomString(32);
        this.nodes = [];
        var scope = this;
        this.server.on('connection', function (socket) {
            var recievedMessages = [];
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
                    crypt.channel = "";
                }
                if (crypt.forwardings == undefined) {
                    crypt.forwardings = 0;
                }
                var included = false;
                for (var m = 0; m < recievedMessages.length; m++) {
                    if (recievedMessages[m].id == crypt.id) {
                        included = true;
                    }
                }
                if (!included) {
                    // @ts-ignore
                    if (subscribedChannels.includes(crypt.channel) || subscribedChannels.length == 0 | subscribedChannels[0] == '*') {
                        try {
                            var data = JSON.parse(crypt_1.cryptTools.decrypt(crypt.data, _this.key));
                            callback(crypt.channel, data.content, {
                                forwardings: crypt.forwardings
                            });
                        }
                        catch (error) {
                            return;
                        }
                    }
                    recievedMessages.push({
                        id: crypt.id,
                    });
                    for (var i = 0; i < _this.nodes.length; i++) {
                        _this.nodes[i].socket.emit('data', {
                            data: crypt.data,
                            id: crypt.id,
                            channel: crypt.channel,
                            forwardings: ++crypt.forwardings
                        });
                    }
                    //better but slower, uses 2x more cpu and memory
                    // setTimeout(function() {
                    //     recievedMessages.shift();
                    // }, 1000 * 10  );
                    //worse but is fast and more efficient
                    if (recievedMessages.length == 500) {
                        recievedMessages.shift();
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
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].socket.emit('data', {
                data: crypt_1.cryptTools.encrypt(JSON.stringify({
                    content: data,
                }), this.key),
                id: strings_1.stringsTools.randomString(80),
                channel: channel,
                forwardings: 0
            });
        }
    };
    return Node;
}());
exports.Node = Node;
