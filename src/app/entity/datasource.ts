export class Datasource {
    public id: string;
    public name: string;
    public description: string;
    public host: string;
    public metadata: string;
    public enabled: boolean;
    public created: string;
    public authenticationProxyUrl: string;
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
    setAutheticationProxyUrl(proxyURL: string) {
        this.authenticationProxyUrl = proxyURL;
    }
}

export class Download {
    public id: string;
    public name: string;
    public lang: string;
    public description: string;
    public link: string;
    public enabled: boolean;
    public created: string;
    public category: string;
    public metadata: string;

    constructor(id: string, name: string, lang: string, description: string, link: string, enabled: boolean, created: string, category: string, metadata: string) {
        this.id = id;
        this.name = name;
        this.lang = lang;
        this.description = description;
        this.link = link;
        this.enabled = enabled;
        this.created = created;
        this.category = category;
        this.metadata = metadata;
    }
}
