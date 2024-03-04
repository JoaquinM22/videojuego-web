import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { HistorialComponent } from './components/historial/historial.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { TipoPartidaComponent } from './components/game-components/tipo-partida/tipo-partida.component';
import { PartidaComponent } from './components/game-components/partida/partida.component';
import { TemporizadorComponent } from './components/game-components/temporizador/temporizador.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule
({
  declarations:
  [
    AppComponent,
    InicioComponent,
    LoginComponent,
    MenuComponent,
    HistorialComponent,
    RankingComponent,
    PerfilComponent,
    TipoPartidaComponent,
    PartidaComponent,
    TemporizadorComponent,
    FooterComponent
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
