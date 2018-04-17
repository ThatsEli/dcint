const expect = require("chai").expect;
const dcint = require('../../lib/index');

describe("Base test", function () {

    it("Creates a node", function () {
        var node = new dcint.Node(30034, ['*'], () => {});
        expect(node != undefined).to.equal(true);
    });

    it("Sets an encryptionkey", function () {
        var node = new dcint.Node(30034, ['*'], () => {});
        node.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
        expect(node.key).to.equal("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
    });

    it("Attach to a node", function () {
        var node1 = new dcint.Node(50001, ['*'], () => {});
        var node2 = new dcint.Node(50002, ['*'], () => {});
        node1.attachToNodes(['localhost:5001']);
        expect(node1.nodes[0].host).to.equal('ws://localhost:5001');
    });

    it("Send a message between two nodes", function (done) {

        var node1 = new dcint.Node(40005, ['*'], () => {});
        var node2 = new dcint.Node(50005, ['*'], () => { done(); });

        node1.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
        node2.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

        node1.attachToNodes(['localhost:50005']);
        node2.attachToNodes(['localhost:40005']);

        setTimeout(function () {
            node1.emitData('test', {
                test1: true
            });
        }, 50);
    });

});