import { Server, Socket } from "socket.io";
import { cryptTools } from '../tools/crypt';
import { stringsTools } from '../tools/strings';
import { Crypt } from '../interfaces/Crypt';
import { Message } from '../interfaces/Message';
import { NodeI } from '../interfaces/NodeI';

export class Node {

    private server: Server;
    public key: string;
    private nodes: NodeI[];

    constructor(port: number, subscribedChannels: string[], callback: Function) {
        this.server = require('socket.io')();
        this.server.listen(port);
        this.key = stringsTools.randomString(32);
        this.nodes = [];

        let scope: this = this;


        this.server.on('connection', (socket: Socket) => {
            let recievedMessages: Message[] = [];

            socket.on('data', (crypt: Crypt) => {

                if(crypt == undefined) { return; }
                if(crypt.id == undefined ) { return; }
                if(crypt.data == undefined ) { return; }
                if(crypt.channel == undefined ) { crypt.channel = ""; }
                if(crypt.forwardings == undefined ) { crypt.forwardings = 0; }

                let included: boolean = false;
                for (let m: number = 0; m < recievedMessages.length; m++) {
                    if (recievedMessages[m].id == crypt.id) {
                        included = true;
                    }
                }

                if (!included) {
                    // @ts-ignore
                    if (subscribedChannels.includes(crypt.channel) || subscribedChannels.length == 0 | subscribedChannels[0] == '*') {
                        try {
                            let data: { content: object } = JSON.parse( cryptTools.decrypt(crypt.data, this.key));
                            callback(crypt.channel, data.content, {
                                forwardings: crypt.forwardings
                            });
                        } catch (error) { return; }
                    }

                    recievedMessages.push({
                        id: crypt.id,
                    });

                    for (let i: number = 0; i < this.nodes.length; i++) {
                        this.nodes[i].socket.emit('data', {
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
                    if(recievedMessages.length == 500) {
                        recievedMessages.shift();
                    }
                }
            });
        });
    }

    setEncryptionKey(newKey: string): void {
        this.key = newKey;
    }

    attachToNodes(nodes: string[]) {
        for (let i: number = 0; i < nodes.length; i++) {
            const node: string = nodes[i];
            this.nodes.push({
                host: 'ws://' + node,
                socket: require('socket.io-client')('ws://' + node)
            });
        }
    }

    getConnectedNodes(): string[] {
        let connectedNodes: string[] = [];
        for (let i: number = 0; i < this.nodes.length; i++) {
            connectedNodes.push(this.nodes[i].host);
        }
        return connectedNodes;
    }

    emitData(channel: string, data: object) {
        for (let i: number = 0; i < this.nodes.length; i++) {
            this.nodes[i].socket.emit('data', {
                data: cryptTools.encrypt(JSON.stringify({
                    content: data,
                }), this.key),
                id: stringsTools.randomString(80),
                channel: channel,
                forwardings: 0
            });
        }
    }



}
