import {URI} from "./index";

export interface IWithdrawStore {
    WithdrawAllTokens(resource: URI): Promise<void>;

    CheckIfWithdrawed(resource: URI, since?: Date): Promise<boolean>;
}
