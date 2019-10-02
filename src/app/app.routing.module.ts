import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { WmsSearchComponent } from './wms/wms-search/wms-search.component';

const routes: Routes = [
    { path: 'map/:type', component : MapComponent },
    { path: 'wms', component: WmsSearchComponent },
    {
        path: "**",
        redirectTo: "/map/deforestation",
        pathMatch: "full"
    }
];

@NgModule({
imports: [
    RouterModule.forRoot(routes)
],
exports: [
    RouterModule
],
declarations: []
})
export class AppRoutingModule { }
