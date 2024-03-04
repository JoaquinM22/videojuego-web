import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component
({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent
{
  cartelAdvertencia: boolean = false;

  constructor(private router: Router, private usuariosService: UsuariosService)
  {
    
  }

  titulo: boolean = true;
  menu: boolean = true;
  crearPartida: boolean = false;
  ranking: boolean = false;
  perfil: boolean = false;
  historial: boolean = false;
 

  recibiendoDatosDesdeCreadorPartida(mensaje : string)
  {
    if(mensaje == 'false')
    {
      this.crearPartida = false;
      this.menu = true;
      this.titulo = true;
    }
  }

  desabilitarTodosLosComponentes()
  {
    this.crearPartida = false;
    this.ranking = false;
    this.perfil = false;
    this.historial = false;
  }

  cerrarSesion()
  {
    this.usuariosService.limpiarDatos();
    this.router.navigate(['/inicio']);
  }
}
