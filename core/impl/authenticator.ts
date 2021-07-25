import {AccessMode, IAuthenticator, IIssuer, IRuleStore, IValidator, ResourceToken, URI} from "../contracts";

export class Authenticator implements IAuthenticator {

    constructor(
        protected ruleStore: IRuleStore,
        protected validator: IValidator,
        protected issuer: IIssuer,
    ) {

    }

    public async Authenticate(resource: URI, token: ResourceToken): Promise<ResourceToken> {
        if (token.URI === resource){
            const isValid = await this.validator.Validate(token);
            return isValid ? token : null;
        }
        const rules = await this.ruleStore.GetRules(resource);
        for (let rule of rules) {
            if (rule.InheritedFrom !== token.URI)
                continue;
            const isValid = await this.validator.Validate(token);
            if (!isValid)
                return null;
            const newToken = await this.issuer.Issue(resource, {
                Rule: rule,
                Token: token
            });
            return newToken;
        }
    }

}
