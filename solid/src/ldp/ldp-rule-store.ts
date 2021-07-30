import {AccessInheritanceRule, AccessMode, RuleStore, URI} from "@inhauth/core";
import {LdpStore} from "./ldp-store";


const inhFromPredicate = `https://hia.org/inheritedFrom`;
const acl = `http://www.w3.org/ns/auth/acl`;
const accModePredicate = `${acl}#mode`;
const aclAccessMap = {
    [`${acl}#Read`]: AccessMode.read,
    [`${acl}#Write`]: AccessMode.write | AccessMode.read,
    [`${acl}#Append`]: AccessMode.append,
    [`${acl}#Control`]: AccessMode.control,
};

export class LdpRuleStore {
    constructor(private readonly store: LdpStore) {

    }

    public UpdateRules(resource: string, add: AccessInheritanceRule[], remove: AccessInheritanceRule[]): Promise<void> {
        throw new Error("Method not implemented.");
    }


    public async GetRules(resource: URI): Promise<AccessInheritanceRule[]> {
        const hiaTriples = await this.store.get(resource);
        const result: { [key: string]: AccessInheritanceRule } = {};
        for (let hiaTriple of hiaTriples) {
            if (hiaTriple.predicate.value == inhFromPredicate) {
                const uri = hiaTriple.object.value;
                result[hiaTriple.subject.value] = {
                    ...result[hiaTriple.subject.value],
                    InheritedFrom: uri,
                }
            }
            if (hiaTriple.predicate.value == accModePredicate) {
                const accessMode = aclAccessMap[hiaTriple.object.value];
                result[hiaTriple.subject.value] = {
                    ...result[hiaTriple.subject.value],
                    AccessMode: (result[hiaTriple.subject.value].AccessMode ?? AccessMode.none) | accessMode
                };
            }
        }
        return Object.values(result);
    }

}
