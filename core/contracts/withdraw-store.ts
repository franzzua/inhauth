export abstract class WithdrawStore {
    abstract WithdrawAllTokens(resource: string): Promise<void>;

    abstract CheckIfWithdrawed(resource: string, since?: Date): Promise<boolean>;
}
