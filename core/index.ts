import {Issuer} from "./impl/issuer";
import {InMemoryWithdrawStore} from "./impl/in-memory-withdraw-store";
import {Authenticator} from "./impl/authenticator";
import {RuleStoreMock} from "./test/mocks/rule-store.mock";
import {Validator} from "./impl/validator";
import {IAuthenticator, IIssuer, IRuleStore, IWithdrawStore} from "./contracts";

export * from "./contracts";
export {Issuer} from "./impl/issuer"
export {Authenticator} from "./impl/authenticator"
export {Validator} from "./impl/validator"
export {InMemoryRuleStore} from "./impl/in-memory-rule-store"
export {InMemoryWithdrawStore} from "./impl/in-memory-withdraw-store"

export class AuthManager{

    constructor(private withdrawer: IWithdrawStore,
                private ruleStore: IRuleStore) {
    }

    public issuer: IIssuer = new Issuer();
    public authenticator: IAuthenticator = new Authenticator(
        this.ruleStore,
        new Validator(this.withdrawer),
        this.issuer
    );

}
