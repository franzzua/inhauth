import {KeyStore} from "../src/key-store";
import {readFileSync} from "fs";

const privateKey = readFileSync(`${__dirname}/keys/jwtRS256.key`, 'utf8');
const publicKey = readFileSync(`${__dirname}/keys/jwtRS256.key.pub`, 'utf8');

export class KeyStoreMock implements KeyStore{
    public async getPrivateKey(): Promise<string> {
        return privateKey;
    }

    public async getPublicKey(uri: string): Promise<string> {
        return publicKey;
    }

}
