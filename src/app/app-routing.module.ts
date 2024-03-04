import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { GuardiaLogueoGuard } from './guardia/guardia-logueo.guard';

const routes: Routes =
[
  {path: 'menu', component: MenuComponent, canActivate: [GuardiaLogueoGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'inicio', component: InicioComponent},
  {path: '**', component: InicioComponent}
];

@NgModule
({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule
{

}
