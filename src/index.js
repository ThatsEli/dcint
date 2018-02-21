// var key = "joO4chN1tmsH8cRF0HeprOd2kwf7GDli"; // !!!32 chars!!!
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

            initNode: function (port) {
                this.server = require('socket.io')();
                this.server.on('connection', function (socket) {});
                this.server.listen(port);
            },

            setupEncryptionKey: function (key) {
                this.key = key;
            },

            attachToNodes: function (nodesToConnect, callback) {
                if (typeof nodesToConnect.length !== "number") {
                    consle.error("[E]Expected array!");
                    return;
                }
                for (let i = 0; i < nodesToConnect.length; i++) {
                    const node = nodesToConnect[i];
                    this.nodes.push({
                        host: 'ws://' + node,
                        socket: require('socket.io-client')('ws://' + node)
                    });

                    var recievedMessages = [];
                    var toDoMessages = [];

                    var scope = this;

                    this.nodes[this.nodes.length - 1].socket.on('data', function (crypt) {
                        var data = JSON.parse(decrypt(crypt.data, scope.key));
                        var included = false;
                        for (let m = 0; m < recievedMessages.length; m++) {
                            if (recievedMessages[m].id == data.id) {
                                included = true;
                            }
                        }

                        if (!included) {
                            var d = new Date();
                            recievedMessages.push({
                                id: data.id, timesamp: d.getTime() 
                            });
                            toDoMessages.push({
                                data: encrypt(JSON.stringify({id: data.id,channel: data.channel,content: data.content,forwardings: ++data.forwardings}), scope.key)
                            });
                            callback(data.channel, data.content, { forwardings: data.forwardings });

                            for (let m = 0; m < toDoMessages.length; m++) {
                                scope.server.sockets.emit('data', toDoMessages[m]);
                            }

                        }
                    });
                }

            },

            handleData(data) {
                
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
                this.server.sockets.emit('data', 
                    {data: encrypt(JSON.stringify({id: randomString(80),channel: channel,content: data,forwardings: 0}), this.key)}
                );
            }

        };
    },



};