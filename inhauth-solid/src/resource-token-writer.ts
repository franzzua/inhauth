import type {Logger, LoggerFactory, MetadataWriter, RepresentationMetadata} from "@solid/community-server";
import {ServerResponse} from "http";
import {ResourceToken} from "@inhauth/core";
import {AccessMode} from "@inhauth/core/dist/index";
import {KeyStore} from "./key-store";
import {decode, sign, verify,} from "jsonwebtoken";
import {resourceTokenHeader} from "./credentials-extractor";

export class ResourceTokenWriter implements MetadataWriter {
    private logger: Logger;

    constructor(private readonly keyStore: KeyStore,
                loggerFactory: LoggerFactory) {
        this.logger = loggerFactory.createLogger('ResourceTokenWriter');
    }


    async canHandle(input: { response: ServerResponse; metadata: RepresentationMetadata; }): Promise<void> {
    }

    async handle(input: { response: ServerResponse; metadata: RepresentationMetadata; }): Promise<void> {
        this.logger.info('send header');
        const token = {
            URI: input.metadata.identifier.value,
            AccessMode: AccessMode.read,
            Expires: new Date(+new Date()+ 24*60*60*1000),
            ResourcePath: [],
            IssueDate: new Date()
        } as ResourceToken;
        const header = await this.Sign(token);
        input.response.setHeader(resourceTokenHeader, header);
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

    async handleSafe(input: { response: ServerResponse; metadata: RepresentationMetadata; }): Promise<void> {
        await this.canHandle(input);
        return this.handle(input);
    }

}
