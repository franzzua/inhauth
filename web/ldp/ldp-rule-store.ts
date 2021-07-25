import {AccessInheritanceRule, AccessMode, IRuleStore, URI} from "@hia/core";
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

export class LdpRuleStore implements IRuleStore {
    private store = new LdpStore();

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
