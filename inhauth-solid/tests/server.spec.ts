import {suite, test, timeout} from "@testdeck/jest";
import  fetch from "isomorphic-fetch";
import {resourceTokenHeader} from "../src/credentials-extractor";

/**
 * You should gen keys before
 * ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
 * # Don't add passphrase
 * openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
 */
@suite
@timeout(10000)
export class ServerSpec{

    private server = 'http://localhost:3000';

    @test
    async testAuth(){
        const resA = await fetch(`${this.server}/resA.ttl`);
        const headers = resA.headers;
        const resourceToken = headers.get(resourceTokenHeader);
        expect(resourceToken).not.toBe(undefined);
        console.log(resourceToken);
        const resB = await fetch(`${this.server}/private/resB.ttl`, {
            headers:  {
                [resourceTokenHeader]: resourceToken
            }
        });
        expect(resB.ok).toBe(true);
    }
}
