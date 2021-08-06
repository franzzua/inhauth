export {IAuthorizer} from "./authorizer";
export {IIssuer} from "./issuer";
export {WithdrawStore} from "./withdraw-store";
export {IValidator} from "./validator";
/**
 * Describes rights that user have on some resource
 */
export interface ResourceToken{
    readonly URI: string;
    readonly AccessMode: AccessMode;
    readonly ResourcePath: ReadonlyArray<string>;
    readonly Expires: Date;
    readonly IssueDate: Date;
}

export type AccessInheritanceRule = {
    readonly AccessMode: AccessMode;
    readonly InheritedFrom: string;
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

export abstract class RuleStore {
    abstract GetRules(resource: string): Promise<AccessInheritanceRule[]>;
    abstract UpdateRules(resource: string, add: AccessInheritanceRule[], remove: AccessInheritanceRule[]): Promise<void>;
}
