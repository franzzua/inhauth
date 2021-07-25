import {ResourceToken} from "./index";

export interface IValidator {
    Validate(token: ResourceToken): Promise<boolean>;
}
