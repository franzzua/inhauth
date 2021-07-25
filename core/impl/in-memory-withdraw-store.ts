import {ResourceToken, URI} from "../contracts";
import {IWithdrawStore} from "../contracts/withdraw-manager";

export class InMemoryWithdrawStore implements IWithdrawStore {

    private Store: { resource: URI; date: Date; }[] = [];

    public async CheckIfWithdrawed(resource: URI, since?: Date): Promise<boolean> {
        return this.Store.some(x => x.resource == resource && (!since || x.date > since));
    }

    public async WithdrawAllTokens(resource: URI): Promise<void> {
        this.Store.push({
            resource,
            date:  new Date()
        });
    }

}
