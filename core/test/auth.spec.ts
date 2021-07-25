import {suite, test,} from "@testdeck/jest";
import {Authenticator} from "../impl/authenticator";
import {RuleStoreMock} from "./mocks/rule-store.mock";
import {Validator} from "../impl/validator";
import {Issuer} from "../impl/issuer";
import {InMemoryWithdrawStore} from "../impl/in-memory-withdraw-store";
import {AccessInheritanceRule, AccessMode, URI} from "../contracts";


export const resources = {
    a: 'local://a' as URI,
    b: 'local://b' as URI,
    c: 'local://c' as URI,
    d: 'local://d' as URI,
}

const rules: {
    [key: string]: AccessInheritanceRule[]
} = {
    [resources.a]: [],
    [resources.b]: [
        {AccessMode: AccessMode.read | AccessMode.write, InheritedFrom: resources.a}
    ],
    [resources.c]: [
        {AccessMode: AccessMode.read, InheritedFrom: resources.b},
        {AccessMode: AccessMode.write, InheritedFrom: resources.a}
    ],
    [resources.d]: [
        {AccessMode: AccessMode.read, InheritedFrom: resources.c}
    ],
}

@suite
export class AuthSpec{

    private issuer = new Issuer();
    private withdrawer = new InMemoryWithdrawStore()
    private authenticator = new Authenticator(
        new RuleStoreMock(rules),
        new Validator(this.withdrawer),
        this.issuer
    );

    @test
    async simpleAuth(){
        const aToken = await this.issuer.Issue(resources.a, AccessMode.read | AccessMode.write);
        const bToken = await this.authenticator.Authenticate(resources.b, aToken);
        expect(bToken.AccessMode).toBe(AccessMode.read | AccessMode.write);
        const cToken = await this.authenticator.Authenticate(resources.c, bToken);
        expect(cToken.AccessMode).toBe(AccessMode.read);
        const dToken = await this.authenticator.Authenticate(resources.d, cToken);
        expect(dToken.AccessMode).toBe(AccessMode.read);
        const cToken2 = await this.authenticator.Authenticate(resources.c, aToken);
        expect(cToken2.AccessMode).toBe(AccessMode.write);
        const dToken2 = await this.authenticator.Authenticate(resources.d, cToken2);
        expect(dToken2.AccessMode).toBe(AccessMode.none);
        this.withdrawer.WithdrawAllTokens(resources.b);
        const cToken3 = await this.authenticator.Authenticate(resources.c, cToken);
        expect(cToken3).toBe(null);
    }
}
