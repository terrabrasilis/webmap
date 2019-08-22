export class Datasource {
    public id: string;
    public name: string;
    public description: string;
    public host: string;
    public metadata: string;
    public enabled: boolean;
    public created: string;
    /**
     * the link list of downloads to download data
     */
    public downloads: Download[];

    // constructor(id:string, name:string, description:string, host: string, metadata:string, enabled:boolean, created:string, downloads: Download[]){
    //     this.id = id;
    //     this.name = name;
    //     this.description = description;
    //     this.host = host;
    //     this.metadata = metadata;
    //     this.enabled = enabled;
    //     this.created = created;
    //     this.downloads = downloads;
    // }

    constructor() {}

    addHost(host: string) {
        this.host = host;
        return this;
    }
}

export class Download {
    public id: string;
    public name: string;
    public description: string;
    public link: string;
    public enabled: boolean;
    public created: string;

    constructor(id: string, name: string, description: string, link: string, enabled: boolean, created: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.link = link;
        this.enabled = enabled;
        this.created = created;
    }
}
