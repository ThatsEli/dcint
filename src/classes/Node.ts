import { Server, Socket } from "socket.io";
import { cryptTools } from '../tools/crypt';
import { stringsTools } from '../tools/strings';
import { Crypt } from '../interfaces/Crypt';
import { NodeI } from '../interfaces/NodeI';
import hash from 'object-hash';


export class Node {

    private server: Server;
    public key: string;
    private nodes: NodeI[];

    private bufferSize = 500;

    constructor(port: number, subscribedChannels: string[], callback: Function) {
        this.server = require('socket.io')();
        this.server.listen(port);
        this.key = stringsTools.randomString(32);
        this.nodes = [];

        let scope: this = this;


        this.server.on('connection', (socket: Socket) => {
            let receivedMessages: Crypt[] = [];

            socket.on('data', (crypt: Crypt) => {

                if(crypt == undefined) { return; }
                if(crypt.id == undefined ) { return; }
                if(crypt.data == undefined ) { return; }
                if(crypt.channel == undefined ) { crypt.channel = ""; }
                if(crypt.forwardings == undefined ) { crypt.forwardings = 0; }

                let included: boolean = false;
                if(receivedMessages.some((m) => { return m.id === crypt.id })) {
                    included = true;
                }

                if (!included) {
                    // @ts-ignore
                    if (subscribedChannels.includes(crypt.channel) || subscribedChannels.length == 0 || subscribedChannels[0] == '*') {
                        try {
                            // console.log(crypt.id, hash(crypt.data));
                            if(crypt.id == hash(crypt.data)) {
                                callback(crypt.channel, JSON.parse(cryptTools.decrypt(crypt.data, this.key)).content, {
                                    forwardings: crypt.forwardings
                                });
                            }
                        } catch (error) { return; }
                    }

                    let cryptObj: Crypt = {
                        data: crypt.data,
                        id: crypt.id,
                        channel: crypt.channel,
                        forwardings: ++crypt.forwardings
                    };

                    receivedMessages.push(cryptObj);

                    for (let i: number = 0; i < this.nodes.length; i++) {
                        this.nodes[i].socket.emit('data', cryptObj);
                    }

                    //better but slower, uses more cpu and memory
                    // setTimeout(function() {
                    //     recievedMessages.shift();
                    // }, 1000 * 10  );

                    //worse but is fast and more efficient
                    if(receivedMessages.length == this.bufferSize) {
                        receivedMessages.shift();
                    }
                }
            });
        });
    }

    setEncryptionKey(newKey: string): void {
        this.key = newKey;
    }

    attachToNodes(nodes: string[]): void {
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

    emitData(channel: string, data: object): void {
        let dataObj: any = {
            data: cryptTools.encrypt(JSON.stringify({
                content: data,
            }), this.key),
            // id: stringsTools.randomString(80),
            channel: channel,
            forwardings: 0
        }; dataObj.id = hash(dataObj.data);
        for (let i: number = 0; i < this.nodes.length; i++) {
            this.nodes[i].socket.emit('data', dataObj);
        }
    }



}
