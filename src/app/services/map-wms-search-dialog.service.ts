import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class MapWmsSearchDialogService {

  layer: any = {};
  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() { }

  updateMapLayerFromWmsSearch(layer: any) {
    this.layer = layer;
    this.change.emit(this.layer);
  }

}
