import {AccessInheritanceRule, IRuleStore, URI} from "../contracts";

export class InMemoryRuleStore implements IRuleStore{

    protected rules: {
        [key: string]: AccessInheritanceRule[]
    } = {

    };

    public async GetRules(resource: URI): Promise<AccessInheritanceRule[]> {
        return this.rules[resource] ?? [];
    }

}
