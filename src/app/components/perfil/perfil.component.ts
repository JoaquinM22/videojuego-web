import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component
({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent
{
  puntaje: number = this.usuariosService.obtenerDatos().puntos
  nombre: string = this.usuariosService.obtenerDatos().usuario;

  constructor(private usuariosService: UsuariosService)
  {
    
  }
}
