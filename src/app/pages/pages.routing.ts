import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesaComponent } from './promesas/promesa/promesa.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';


const routes: Routes = [
    {
        path: 'dashboard', 
        component: PagesComponent,
        canActivate:[AuthGuard],
        children:[
          {path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
          {path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil'}},
          {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Account Settings'}},
          {path: 'progress', component: ProgressComponent, data: {titulo: 'Progress Bar'}},
          {path: 'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica #1'}},
          {path: 'promesa', component: PromesaComponent, data: {titulo: 'Promesa'}},
          {path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'}},

          //Mantenimientos
          {path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Usuario de aplicación'}},



        ]
      }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
