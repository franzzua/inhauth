import {AccessMode, AuthManager, RuleStore, WithdrawStore, ResourceToken, URI} from "@inhauth/core";
import {Authorization, Authorizer, AuthorizerArgs, RepresentationMetadata,} from "@solid/community-server";
import {IncomingMessage, ServerResponse} from "http";
import {KeyStore} from "./key-store";
import {decode, sign, verify,} from "jsonwebtoken";
import {InhCredentials} from "./credentials-extractor";
import {LdpRuleStore} from "./ldp/ldp-rule-store";
import {LdpWithdrawStore} from "./ldp/ldp-withdraw-store";

export class InheritedAuthorizer implements Authorizer {

    constructor(private readonly keyStore: KeyStore,
                private readonly withdrawStore: LdpWithdrawStore,
                private readonly ruleStore: LdpRuleStore) {
    }

    async canHandle(input: AuthorizerArgs): Promise<void> {
        if ((input.credentials as InhCredentials).resourceToken != null)
            return;
        throw new Error("InheritedAuthorizer does not support anything(.");
    }

    async handle(input: AuthorizerArgs): Promise<Authorization> {
        const inhCredentials = input.credentials as InhCredentials;
        if (inhCredentials.resourceToken){
            const result = await this.authManager.authorizer.Authorize(
                input.identifier.path, inhCredentials.resourceToken
            );
            if (!result)
                throw new Error("authorization failed");
            return new InhAuthorization(result);
        }
    }

    async handleSafe(input: AuthorizerArgs): Promise<Authorization> {
        await this.canHandle(input);
        return this.handle(input);
    }

    public async Issue(uri: URI, accessMode: AccessMode) {
        const token = await this.authManager.issuer.Issue(uri, accessMode);
        return await this.Sign(token);
    }

    private async Sign(token: ResourceToken) {
        const privateKey = await this.keyStore.getPrivateKey();
        const signed = await new Promise<string>(resolve =>
            sign(token, privateKey, {
                expiresIn: Math.floor((+token.Expires - +new Date()) / 1000),
                algorithm: 'RS256'
            }, (err, signature) => resolve(signature))
        );
        return signed;
    }

    //@ignore
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
        const result = await this.authManager.authorizer.Authorize(uri as URI, token);
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

export class InhAuthorization implements Authorization {

    constructor(private resourceToken: ResourceToken) {

    }

    addMetadata(metadata: RepresentationMetadata){
        metadata.add('resource-token', JSON.stringify(this.resourceToken));
    }

}
