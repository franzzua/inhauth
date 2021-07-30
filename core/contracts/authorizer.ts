import {AccessMode, ResourceToken} from "./index";

export interface IAuthorizer {
    Authorize(resource: string, token: ResourceToken): Promise<ResourceToken>;
}
