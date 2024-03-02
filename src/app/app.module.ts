import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { HistorialComponent } from './components/historial/historial.component';

@NgModule
({
  declarations:
  [
    AppComponent,
    InicioComponent,
    LoginComponent,
    MenuComponent,
    HistorialComponent
  ],

  imports:
  [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],

  providers:
  [

  ],

  bootstrap:
  [
    AppComponent
  ]
})

export class AppModule
{ 
  
}
