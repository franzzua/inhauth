import {AccessMode, IAuthorizer, IIssuer, RuleStore, IValidator, ResourceToken} from "../contracts";

export class Authenticator implements IAuthorizer {

    constructor(
        protected ruleStore: RuleStore,
        protected validator: IValidator,
        protected issuer: IIssuer,
    ) {

    }

    public async Authorize(resource: string, token: ResourceToken): Promise<ResourceToken> {
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
