"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __importStar(require("crypto"));
var cryptTools = /** @class */ (function () {
    function cryptTools() {
    }
    cryptTools.encrypt = function (text, key) {
        var iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);
        var encrypted = cipher.update(new Buffer(text));
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    };
    cryptTools.decrypt = function (text, key) {
        var textParts = text.split(':');
        var shift = textParts.shift();
        var iv = new Buffer(shift, 'hex');
        var encryptedText = new Buffer(textParts.join(':'), 'hex');
        var decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);
        var decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    };
    return cryptTools;
}());
exports.cryptTools = cryptTools;
