import {AccessMode, ResourceToken, URI} from "./index";

export interface IAuthenticator {
    Authenticate(resource: URI, token: ResourceToken): Promise<ResourceToken>;
}
