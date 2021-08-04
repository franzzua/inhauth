import {KeyStore} from "../key-store";
import {readFileSync} from "fs";

const privateKey = readFileSync(`./keys/jwtRS256.key`, 'utf8');
const publicKey = readFileSync(`./keys/jwtRS256.key.pub`, 'utf8');

export class LdpKeyStore implements KeyStore{

    constructor() {

    }
    public async getPrivateKey(): Promise<string> {
        return privateKey;
    }

    public async getPublicKey(uri: string): Promise<string> {
        return publicKey;
    }

}
