import type {Credentials, CredentialsExtractor, HttpRequest, Logger, LoggerFactory} from "@solid/community-server";
import {ResourceToken} from "@inhauth/core";
import {KeyStore} from "./key-store";
import {decode} from "jsonwebtoken";

export const resourceTokenHeader = 'Resource-Token';

export class InhCredentialsExtractor implements CredentialsExtractor {
    private logger: Logger;

    constructor(private readonly keyStore:  KeyStore,
                loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.createLogger('InhCredentialsExtractor');
    }

    async canHandle(input: HttpRequest): Promise<void> {
        if (resourceTokenHeader.toLowerCase() in input.headers) {
            this.logger.info("token found");
            return;
        }
        throw new Error("Resource token not found");
    }

    async handle(input: HttpRequest): Promise<Credentials> {
        this.logger.info("token handler");
        const header =  input.headers[resourceTokenHeader.toLowerCase()] as string;
        this.logger.info(header);
        const token = await this.Decode(header);
        return {
            resourceToken: token,
            webId: ''
        } as InhCredentials;
    }
    async handleSafe(input: HttpRequest): Promise<Credentials> {
        await this.canHandle(input);
        return this.handle(input);
    }

    private async Decode(tokenString: string) {
        const jwt = decode(tokenString, {complete: true});
        const token = jwt.payload as ResourceToken;
        return token;
    }
}

export interface InhCredentials extends Credentials{
    resourceToken: ResourceToken
}
