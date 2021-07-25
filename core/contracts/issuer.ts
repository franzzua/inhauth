import {AccessMode, InheritedAccess, ResourceToken, URI} from "./index";

export interface IIssuer {
    Issue(resource: URI, inheritedAccess: InheritedAccess): Promise<ResourceToken>;

    Issue(resource: URI, accessMode: AccessMode): Promise<ResourceToken>;
}
