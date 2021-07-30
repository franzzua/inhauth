import {WithdrawStore, URI} from "@inhauth/core";
import {LdpStore} from "./ldp-store";

export class LdpWithdrawStore {
    constructor(private readonly store: LdpStore) {

    }

    private static withdrawPredicate = 'https://hia.org/withdrawed';

    async WithdrawAllTokens(resource: URI) {
        this.store.append(resource, `<${resource}> <${LdpWithdrawStore.withdrawPredicate}> ${new Date().toISOString()}`);
    }

    async CheckIfWithdrawed(resource: URI, since?: Date): Promise<boolean> {
        const hiaTriples = await this.store.get(resource);
        const withdraws = hiaTriples.filter(x => x.predicate.value == LdpWithdrawStore.withdrawPredicate);
        if (!since)
            return withdraws.length > 0
        const withdrawedAfterSince = withdraws.map(x => x.object.value)
            .map(Date.parse)
            .some(d => +d > +since);
        return withdrawedAfterSince;
    }

}
