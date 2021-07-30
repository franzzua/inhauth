import {KeyStore} from "../key-store";

export class LdpKeyStore implements KeyStore{

    constructor() {

    }


    public getPrivateKey(): Promise<string> {
        return Promise.resolve("");
    }

    public getPublicKey(uri: string): Promise<string> {
        return Promise.resolve("");
    }

}
