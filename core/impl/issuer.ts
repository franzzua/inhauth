import {AccessMode, InheritedAccess, ResourceToken, URI} from "../contracts";
import {IIssuer} from "../contracts/issuer";

const day = 1000*3600*24;

export class Issuer implements IIssuer {
    private expiration: number = day;

    public async Issue(resource: URI, access: InheritedAccess | AccessMode): Promise<ResourceToken> {
        const now = new Date();
        const expires = new Date(+now + this.expiration);
        const token = {
            URI: resource,
            IssueDate: now,
            Expires: expires,
        };
        if (typeof access === "number"){
            return {
                ...token,
                AccessMode: access,
                ResourcePath: []
            };
        }
        const accessMode = access.Rule.AccessMode & access.Token.AccessMode;
        return {
            ...token,
            AccessMode: accessMode,
            ResourcePath: [...access.Token.ResourcePath, access.Token.URI]
        };
    }

}
