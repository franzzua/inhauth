import {AccessMode, InheritedAccess, ResourceToken} from "./index";

export interface IIssuer {
    Issue(resource: string, inheritedAccess: InheritedAccess): Promise<ResourceToken>;

    Issue(resource: string, accessMode: AccessMode): Promise<ResourceToken>;
}
