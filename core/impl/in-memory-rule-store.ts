import {AccessInheritanceRule, RuleStore} from "../contracts";

export class InMemoryRuleStore implements RuleStore {

    protected rules: {
        [key: string]: AccessInheritanceRule[]
    } = {};

    public async GetRules(resource: string): Promise<AccessInheritanceRule[]> {
        return this.rules[resource] ?? [];
    }

    public async UpdateRules(resource: string, add: AccessInheritanceRule[], remove: AccessInheritanceRule[]): Promise<void> {
        this.rules[resource] = [
            ...(this.rules[resource] ?? []),
            ...add
        ].filter(x => !remove.map(x => x.InheritedFrom).includes(x.InheritedFrom));
    }

}
