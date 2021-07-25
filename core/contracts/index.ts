export {IAuthenticator} from "./authenticator";
export {IIssuer} from "./issuer";
export {IWithdrawStore} from "./withdraw-manager";
export {IValidator} from "./validator";

export type URI = string;
/**
 * Describes rights that user have on some resource
 */
export type ResourceToken = {
    readonly URI: URI;
    readonly AccessMode: AccessMode;
    readonly ResourcePath: ReadonlyArray<URI>;
    readonly Expires: Date;
    readonly IssueDate: Date;
}

export type AccessInheritanceRule = {
    readonly AccessMode: AccessMode;
    readonly InheritedFrom: URI;
}

export type InheritedAccess = {
    Rule: AccessInheritanceRule;
    Token: ResourceToken;
}

export enum AccessMode {
    none = 0,
    read = 1,
    write = 2,
    append = 4,
    control = 8
}

export interface IRuleStore {
    GetRules(resource: URI): Promise<AccessInheritanceRule[]>;
}
