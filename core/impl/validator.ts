import {ResourceToken} from "../contracts";
import {IValidator} from "../contracts/validator";
import {WithdrawStore} from "../contracts/withdraw-store";

export class Validator implements IValidator {

    constructor(private withdrawManager: WithdrawStore){

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
