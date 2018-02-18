var key = "joO4chN1tmsH8cRF0HeprOd2kwf7GDli"; // !!!32 chars!!!
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

module.exports =  {

    createNode: function() {

        return {

            nodes: [],

            server: {},

            callback: function() {},

            initNode: function(port) {
                this.server = require('socket.io')();
                this.server.on('connection', function(socket){});
                this.server.listen(port);
            },

            attachToNodes: function(nodesToConnect, callback) {
                if( typeof nodesToConnect.length !== "number") { consle.error("[E]Expected array!"); return; }
                for (let i = 0; i < nodesToConnect.length; i++) {
                    const node = nodesToConnect[i];
                    this.nodes.push( { host: 'ws://' + node, socket: require('socket.io-client')('ws://' + node) } );
                    var x = this.nodes[this.nodes.length-1].host;
                    this.nodes[this.nodes.length-1].socket.on('data', function(crypt) {
                        var data = crypt;
                        // var data = JSON.parse(decrypt(crypt), key)| {};
                        // var data = JSON.parse(crypt);
                        callback(data.data);
                    });
                }

            },

            getConnectedNodes: function() {
                var attachToNodes = [];
                for (let i = 0; i < this.nodes.length; i++) {
                    const node  = this.nodes[i];
                    if(node.socket.connected) {
                        attachToNodes.push(node.host);
                    }
                }
                return attachToNodes;
            },

            emitData: function(data) {
                // this.server.sockets.emit('data', { data: encrypt(JSON.stringify(data), key) });
                this.server.sockets.emit('data', { data: data });
            }

        };
    },



};