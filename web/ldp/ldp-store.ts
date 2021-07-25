import {Parser, Triple} from "n3";
import {URI} from "@hia/core";
import * as fetch from "isomorphic-fetch";

export class LdpStore {
    private parser = new Parser();

    private getHiaURI(resource: URI) {
        const uriWithoutHash = resource.substring(0, resource.indexOf('#'));
        return uriWithoutHash + '.hia';
    }

    private isLocal(resource: URI) {
        return false;
    }

    private getRemote(resource: URI) {
        return fetch(this.getHiaURI(resource));
    }

    private getLocal(resource: URI) {

    }

    public async get(resource: URI): Promise<Triple[]> {
        const content = this.isLocal(resource) ?
            await this.getLocal(resource) :
            await this.getRemote(resource);
        const triples = this.parser.parse(content);
        return triples;
    }

    public append(resource: URI, content) {
        fetch(this.getHiaURI(resource), {
            method: 'PUT',
            headers: {
                'Content-Type': 'SPARQL/UPDATE'
            },
            body: `INSERT DATA {${content}};`
        });
    }
}
