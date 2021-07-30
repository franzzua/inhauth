export abstract class KeyStore {
    abstract getPublicKey(uri: string): Promise<string>;

    abstract getPrivateKey(): Promise<string>;
}

