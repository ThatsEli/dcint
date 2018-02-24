/***************************************************************************
 *                                                                         *
 *   Copyright (C) 2018 by thatseli                                        *
 *   All rights reserved                                                   *
 *                                                                         *
 *   http://thatseliyt.de <public@thatseliyt.de                            *
 *                                                                         *
 ***************************************************************************/

const IV_LENGTH = 16;

const crypto = require('crypto');


function encrypt(text, key) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, key) {
    let textParts = text.split(':');
    let iv = new Buffer(textParts.shift(), 'hex');
    let encryptedText = new Buffer(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = {

    createNode: function () {

        return {

            nodes: [],

            server: {},

            key: randomString(32),

            initNode: function (port, subscribedChannels, callback) {
                this.server = require('socket.io')();
                this.server.on('connection', function (socket) {});
                this.server.listen(port);

                var scope = this;

                this.server.on('connect', function (socket) {
                    var toDoMessages = [];
                    var recievedMessages = [];
                    socket.on('data', function (crypt) {

                        var included = false;
                        for (let m = 0; m < recievedMessages.length; m++) {
                            if (recievedMessages[m].id == crypt.id) {
                                included = true;
                            }
                        }

                        if (!included) {

                            if (subscribedChannels.includes(crypt.channel) || subscribedChannels.length == 0 | subscribedChannels[0] == '*') {
                                var data = JSON.parse(decrypt(crypt.data, scope.key));
                                callback(crypt.channel, data.content, {
                                    forwardings: crypt.forwardings
                                });
                            }

                            var d = new Date();
                            recievedMessages.push({
                                id: crypt.id,
                                timesamp: d.getTime()
                            });

                            var messageIndex = recievedMessages.length - 1;

                            setTimeout(function() {
                                recievedMessages.splice(messageIndex, 1);
                            },  (1000 * 60) * 1  );
                            // if(recievedMessages.length == 100) {
                            //     recievedMessages.shift();
                            // }

                            for (let i = 0; i < scope.nodes.length; i++) {
                                const node = scope.nodes[i];
                                node.socket.emit('data', {
                                    data: crypt.data,
                                    id: crypt.id,
                                    channel: crypt.channel,
                                    forwardings: ++crypt.forwardings
                                });
                            }
                        }
                    });
                });
            },

            subscribeChannel: function (channel) {
                this.subscribedChannels.push(channel);
            },

            unSubscribeChannel: function (channel) {
                this.subscribedChannels.splice(this.subscribedChannels.indexOf(channel), 1);
            },

            setupEncryptionKey: function (key) {
                this.key = key;
            },

            attachToNodes: function (nodesArray) {

                if (typeof nodesArray.length !== "number") {
                    consle.error("[E]Expected array!");
                    return;
                }
                for (let i = 0; i < nodesArray.length; i++) {
                    const node = nodesArray[i];
                    this.nodes.push({
                        host: 'ws://' + node,
                        socket: require('socket.io-client')('ws://' + node)
                    });
                }

            },

            getConnectedNodes: function () {
                var connectedNodes = [];
                for (let i = 0; i < this.nodes.length; i++) {
                    const node = this.nodes[i];
                    if (node.socket.connected) {
                        connectedNodes.push(node.host);
                    }
                }
                return connectedNodes;
            },

            emitData: function (channel, data) {
                for (let i = 0; i < this.nodes.length; i++) {
                    const node = this.nodes[i];
                    node.socket.emit('data', {
                        data: encrypt(JSON.stringify({
                            content: data,
                        }), this.key),
                        id: randomString(80),
                        channel: channel,
                        forwardings: 0
                    });
                }
            }

        };
    },



};