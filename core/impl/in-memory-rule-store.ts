import {AccessInheritanceRule, IRuleStore, URI} from "../contracts";

export class InMemoryRuleStore implements IRuleStore {

    protected rules: {
        [key: string]: AccessInheritanceRule[]
    } = {};

    public async GetRules(resource: URI): Promise<AccessInheritanceRule[]> {
        return this.rules[resource] ?? [];
    }

    public async UpdateRules(resource: URI, add: AccessInheritanceRule[], remove: AccessInheritanceRule[]): Promise<void> {
        this.rules[resource] = [
            ...(this.rules[resource] ?? []),
            ...add
        ].filter(x => !remove.map(x => x.InheritedFrom).includes(x.InheritedFrom));
    }

}
