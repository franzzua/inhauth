import {Parser, Triple} from "n3";
import {URI} from "@inhauth/core";
import * as fetch from "isomorphic-fetch";
import type {ResourceStore} from "@solid/community-server";

const URL = globalThis.global ? require('url').URL : globalThis.URL;


export class LdpStore {
    private parser = new Parser();

    constructor(private readonly resourceStore: ResourceStore) {
    }

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
        const path = new URL(resource).pathname;
        this.resourceStore.getRepresentation({ path }, {})
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
