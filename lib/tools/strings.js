"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringsTools = /** @class */ (function () {
    function stringsTools() {
    }
    stringsTools.randomString = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    return stringsTools;
}());
exports.stringsTools = stringsTools;
