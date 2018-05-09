export declare class Node {
    private server;
    key: string;
    private nodes;
    private bufferSize;
    constructor(port: number, subscribedChannels: string[], callback: Function);
    setEncryptionKey(newKey: string): void;
    attachToNodes(nodes: string[]): void;
    getConnectedNodes(): string[];
    emitData(channel: string, data: object): void;
}
