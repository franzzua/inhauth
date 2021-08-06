import {Parser, Triple} from "n3";
import {URI} from "@inhauth/core";
import * as fetch from "isomorphic-fetch";
import type {ResourceStore} from "@solid/community-server";

const URL = globalThis.global ? require('url').URL : globalThis.URL;


export class LdpStore {
    private parser = new Parser();

    constructor(private readonly resourceStore: ResourceStore) {
    }


    private isLocal(resource: URI) {
        return true;
    }

    private getRemote(resource: URI) {
        const text = fetch(resource).then(x => x.json());
        const triples = this.parser.parse(text);
        return triples;
    }


    private async getLocal(resource: URI) {
        const representation = await this.resourceStore.getRepresentation({
            path: resource,
        }, {
            type: {['internal/quads']: 1},
            encoding: {['utf8']: 1}
        });
        const result = await new Promise<Triple[]>(((resolve, reject) => {
            const quads = [];
            representation.data.on('data', (quad) => quads.push(quad));
            representation.data.on('end', () => resolve(quads));
            representation.data.on('error', reject);
        }));
        return result;
    }


    public async get(resource: URI): Promise<Triple[]> {
        const triples = this.isLocal(resource) ?
            await this.getLocal(resource) :
            await this.getRemote(resource);
        return triples;
    }

    public append(resource: URI, content) {
        fetch(resource, {
            method: 'PUT',
            headers: {
                'Content-Type': 'SPARQL/UPDATE'
            },
            body: `INSERT DATA {${content}};`
        });
    }
}
