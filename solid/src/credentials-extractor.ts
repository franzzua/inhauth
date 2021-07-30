import type {Credentials, CredentialsExtractor, HttpRequest} from "@solid/community-server";
import {ResourceToken} from "@inhauth/core";

const resourceTokenHeader = 'Resource-Token';

export class InhCredentialsExtractor implements CredentialsExtractor {
    async canHandle(input: HttpRequest): Promise<void> {
        if (resourceTokenHeader in input.headers)
            return;
        throw new Error("Resource token not found");
    }
    async handle(input: HttpRequest): Promise<Credentials> {
        return JSON.parse(input.headers[resourceTokenHeader] as string);
    }
    async handleSafe(input: HttpRequest): Promise<Credentials> {
        await this.canHandle(input);
        return this.handle(input);
    }

}

export interface InhCredentials extends Credentials{
    resourceToken: ResourceToken
}
