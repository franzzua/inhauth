import {AccessInheritanceRule, InMemoryRuleStore} from "@inhauth/core";


export class RuleStoreMock extends InMemoryRuleStore {
    constructor(rules:  {
        [key: string]: AccessInheritanceRule[]
    }) {
        super();
        this.rules = rules;
    }


}
