import {AccessMode, AuthManager, IRuleStore, IWithdrawStore, ResourceToken, URI} from "@hia/core";
import type {IncomingMessage, ServerResponse} from "node:http"
import {decode, sign, verify,} from "jsonwebtoken";

export class JWTAuthenticator {

    constructor(private keyStore: IKeyStore,
                private withdrawStore: IWithdrawStore,
                private ruleStore: IRuleStore) {
    }

    public async Issue(uri: URI, accessMode: AccessMode) {
        const token = await this.authManager.issuer.Issue(uri, accessMode);
        return await this.Sign(token);
    }

    private async Sign(token: ResourceToken) {
        const privateKey = await this.keyStore.getPrivateKey();
        const signed = await new Promise<string>(resolve =>
            sign(token, privateKey, {
                expiresIn: Math.floor((+token.Expires - +new Date())/1000),
                algorithm: 'RS256'
            }, (err, signature) => resolve(signature))
        );
        return signed;
    }

    private authManager = new AuthManager(
        this.withdrawStore,
        this.ruleStore
    );

    public async Authenticate(uri: URI, tokenString: string): Promise<string> {
        const jwt = decode(tokenString, {complete: true});
        const token = jwt.payload as ResourceToken;
        const publicKey = await this.keyStore.getPublicKey(uri);
        const isValid = await new Promise((resolve, reject) => verify(tokenString, publicKey, {
            algorithms: ['RS256']
        }, (err, response) => err ? reject(err) : resolve(response)));
        if (!isValid)
            return null;
        const result = await this.authManager.authenticator.Authenticate(uri as URI, token);
        if (!result)
            return null;
        const resultToken = await this.Sign(result);
        return resultToken
    }

    public async Handle(request: IncomingMessage, response: ServerResponse) {
        let tokenStrings = request.headers['Resource-Token'];
        if (!tokenStrings)
            return false;
        if (!Array.isArray(tokenStrings)) {
            tokenStrings = [tokenStrings];
        }
        for (let tokenString of tokenStrings) {
            const resultToken = await this.Authenticate(request.url, tokenString);
            if (resultToken) {
                response.setHeader('Resource-Token', resultToken);
                return true;
            }
        }
    }
}

export interface IKeyStore {
    getPublicKey(uri: string): Promise<string>;

    getPrivateKey(): Promise<string>;
}

