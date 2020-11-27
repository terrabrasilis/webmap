
export class Filter
{
    layerId: string;
    layerName: string;
    workspace: string;
    time: string;
    initialDate?: Date;
    finalDate?: Date;

    public fromObject(object: any) {
        this.layerId=object.layerId;
        this.layerName=object.layerName;
        this.workspace=object.workspace;
        this.time=object.time;
        this.initialDate=object.initialDate;
        this.finalDate=object.finalDate;
    }

}
