import type {AccessInheritanceRule, URI} from "@inhauth/core";
import {KeyStoreMock} from "./key-store.mock";
import {InheritedAuthorizer} from "../src/inherited-authorizer";
import {suite, test} from "@testdeck/jest";
import {RuleStoreMock} from "./mocks/rule-store.mock";
import {AccessMode, InMemoryWithdrawStore} from "@inhauth/core";


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

/**
 * You should gen keys before
 * ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
 * # Don't add passphrase
 * openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
 */
@suite
export class AuthSpec{

    private auth = new InheritedAuthorizer(
        new KeyStoreMock(),
        new InMemoryWithdrawStore() as any,
        new RuleStoreMock(rules) as any,
        {createLogger(){return console as any; }}
    );

    @test
    async testAuth(){
        const aToken = await this.auth.Issue(resources.a, AccessMode.read | AccessMode.write);
        const bToken = await this.auth.Authenticate(resources.b, aToken);
        expect(bToken).not.toBe(null);
        const cToken = await this.auth.Authenticate(resources.c, bToken);
        expect(cToken).not.toBe(null);
        const dTokenErr = await this.auth.Authenticate(resources.d, bToken);
        expect(dTokenErr).toBe(null);
    }
}
