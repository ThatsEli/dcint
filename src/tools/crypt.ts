import * as crypto from 'crypto';

export class cryptTools {

    public static encrypt(text: string, key: string): string {
        let iv: Buffer = crypto.randomBytes(16);
        let cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);
        let encrypted: Buffer = cipher.update( new Buffer(text) );
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    
    public static decrypt(text: string, key: string): string {
        let textParts = text.split(':');
        let shift: string = textParts.shift() as string;
        let iv: Buffer = new Buffer(shift, 'hex');
        let encryptedText: Buffer = new Buffer(textParts.join(':'), 'hex');
        let decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);
        let decrypted: Buffer = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

}
