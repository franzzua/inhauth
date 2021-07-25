import {InMemoryRuleStore} from "../../impl/in-memory-rule-store";
import {AccessInheritanceRule, AccessMode, URI} from "../../contracts";


export class RuleStoreMock extends InMemoryRuleStore {
    constructor(rules:  {
        [key: string]: AccessInheritanceRule[]
    }) {
        super();
        this.rules = rules;
    }


}
