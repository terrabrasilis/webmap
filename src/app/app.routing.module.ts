import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { WmsSearchComponent } from './wms/wms-search/wms-search.component';

/*
 * Dashboard modules import
 */
import { DeforestationOptionsComponent } from './dashboard/deforestation/deforestation-options/deforestation-options.component';


const routes: Routes = [
    // { path : '', component : MapComponent },
    { path: 'map/:type', component : MapComponent },
    { path: 'user', component: UserComponent },
    { path: 'login', component: LoginComponent },
    { path: 'wms', component: WmsSearchComponent },    
    { path: 'dashboard/deforestation/biomes/:biome/:type', component: DeforestationOptionsComponent },
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