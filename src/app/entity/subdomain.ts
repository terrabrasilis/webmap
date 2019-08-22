export class Subdomain {
    public id: string;
	public name: string;
	public description: string;
	public domain: string;
	public enabled: boolean;
    public created: string;

    constructor(
        id: string,
	       name: string,
	       description: string,
	       domain: string,
	       enabled: boolean,
        created: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.domain = domain;
        this.enabled = enabled;
        this.created = created;
    }
}
