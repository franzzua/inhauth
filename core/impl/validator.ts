import {ResourceToken} from "../contracts";
import {IValidator} from "../contracts/validator";
import {IWithdrawStore} from "../contracts/withdraw-store";

export class Validator implements IValidator {

    constructor(private withdrawManager: IWithdrawStore){

    }

    public async Validate(token: ResourceToken): Promise<boolean> {
        if (token.Expires < new Date())
            return false;
        for (let resource of token.ResourcePath) {
            const isWithdrawed = await this.withdrawManager.CheckIfWithdrawed(resource, token.IssueDate);
            if (isWithdrawed)
                return false;
        }
        return true;
    }

}
