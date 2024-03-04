import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component
({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})

export class RankingComponent implements OnInit
{
  tipoOrdenRanking: string = 'ascendente';

  constructor(private usuariosService: UsuariosService)
  {

  }

  listaUsuarios: Usuario[] | undefined = [];

  ngOnInit(): void
  {
    this.mostrarRanking();
    console.log("Mostre el ranking");
  }

  insertarDatosPartidas()
  {
    const tabla = document.getElementById("cuerpo");
    if(tabla)
    {
      tabla.innerHTML = "";
    }

    if(this.listaUsuarios)
    {
      for(const datos of this.listaUsuarios)
      {
        const fila = document.createElement("tr");
        fila.style.border = '1px solid rgb(255, 255, 255)';

        const usuario = document.createElement("td");
        usuario.style.border = '1px solid rgb(255, 255, 255)';
        usuario.textContent = datos.usuario;
        fila.appendChild(usuario);

        const puntaje = document.createElement("td");
        puntaje.style.border = '1px solid rgb(255, 255, 255)';
        puntaje.textContent =  String(datos.puntos);
        fila.appendChild(puntaje);

        const partidas = document.createElement("td");
        partidas.style.border = '1px solid rgb(255, 255, 255)';
        partidas.textContent = String(datos.partidas);
        fila.appendChild(partidas);

        const promedio = document.createElement("td");
        promedio.style.border = '1px solid rgb(255, 255, 255)';
        if(datos.partidas)
        {
          promedio.textContent =  String(Math.round(datos.puntos/datos.partidas));
        }else
        {
          promedio.textContent =  String(0);
        }
        fila.appendChild(promedio);

        if(tabla)
        {
          tabla.appendChild(fila);
        }
      }
    }
  }

  async mostrarRanking()
  {
    switch(this.tipoOrdenRanking)
    {
      case 'descendente':
        this.listaUsuarios = await this.usuariosService.getUsuarios();
        console.log("Ya obtuve los datos");
        this.listaUsuarios?.reverse();
        this.insertarDatosPartidas();
      break;

      case 'ascendente':
        this.listaUsuarios = await this.usuariosService.getUsuarios();
        console.log("Ya obtuve los datos");
        this.insertarDatosPartidas();
      break;

      default:
        console.log("Error en mostrarRanking()")
      break;
    }
  }
}
