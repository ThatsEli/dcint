const expect = require("chai").expect;
const dcint = require('../../src/index');

describe("Base test", function () {

    it("Creates a node", function () {
        var node = dcint.createNode();
        expect(node != undefined).to.equal(true);
    });

    it("Sets an encryptionkey", function () {
        var node = dcint.createNode();
        node.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
        expect(node.key).to.equal("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
    });

    it("Init a node", function () {
        var node = dcint.createNode();
        node.initNode(4000, ['*'], function () {});
        expect(node.server).to.not.equal(undefined);
    });

    it("Attach to a node", function () {
        var node1 = dcint.createNode();
        node1.initNode(4001, ['*'], function () {});
        var node2 = dcint.createNode();
        node2.initNode(5001, ['*'], function () {});
        node1.attachToNodes(['localhost:5001']);
        expect(node1.nodes[0].host).to.equal('ws://localhost:5001');
    });

    it("Send a message between two nodes", function (done) {

        var node1 = dcint.createNode();
        var node2 = dcint.createNode();

        node1.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");
        node2.setEncryptionKey("joO4chN1tmsH8cRF0HeprOd2kwf7GDli");

        node1.initNode(4003, ['*'], function () {});
        node2.initNode(5003, ['*'], function (channel, data, meta) {
            done();
        });

        node1.attachToNodes(['localhost:5003']);
        node2.attachToNodes(['localhost:4003']);

        setTimeout(function () {
            node1.emitData('test', {
                test1: true
            });
        }, 50);


    }).timeout(2000);
});