import {WithdrawStore} from "../contracts/withdraw-store";

export class InMemoryWithdrawStore implements WithdrawStore {

    private Store: { resource: string; date: Date; }[] = [];

    public async CheckIfWithdrawed(resource: string, since?: Date): Promise<boolean> {
        return this.Store.some(x => x.resource == resource && (!since || x.date > since));
    }

    public async WithdrawAllTokens(resource: string): Promise<void> {
        this.Store.push({
            resource,
            date:  new Date()
        });
    }

}
