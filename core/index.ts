import {Issuer} from "./impl/issuer";
import {InMemoryWithdrawStore} from "./impl/in-memory-withdraw-store";
import {Authenticator} from "./impl/authenticator";
import {Validator} from "./impl/validator";
import {AccessInheritanceRule, IAuthorizer, IIssuer, RuleStore, WithdrawStore, ResourceToken, AccessMode} from "./contracts/index";

export {AccessInheritanceRule, IAuthorizer, IIssuer, RuleStore, WithdrawStore, ResourceToken, AccessMode}
export {Issuer} from "./impl/issuer"
export {Authenticator} from "./impl/authenticator"
export {Validator} from "./impl/validator"
export {InMemoryRuleStore} from "./impl/in-memory-rule-store"
export {InMemoryWithdrawStore} from "./impl/in-memory-withdraw-store"
export class AuthManager {

    constructor(private withdrawer: WithdrawStore,
                private ruleStore: RuleStore) {
    }

    public issuer: IIssuer = new Issuer();
    public authorizer: IAuthorizer = new Authenticator(
        this.ruleStore,
        new Validator(this.withdrawer),
        this.issuer
    );

    public async updateRules(resource: string, add: AccessInheritanceRule[], remove: AccessInheritanceRule[]) {
        await this.ruleStore.UpdateRules(resource, add, remove);
        if (remove.length > 0)
            this.withdrawer.WithdrawAllTokens(resource);
    }

}
