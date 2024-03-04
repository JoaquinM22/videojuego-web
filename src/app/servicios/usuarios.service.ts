import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Partida } from '../interfaces/partida';

@Injectable
({
  providedIn: 'root'
})

export class UsuariosService
{
  url: string = "http://localhost:3000/users?_sort=puntos&_order=desc";
  urlPartida: string = "http://localhost:3000/partida";

  constructor()
  {

  }

  //Variable que se va a usar en las funciones
  login: Usuario = 
  {
    id: 0,
    usuario: "",
    password: "",
    puntos: 0,
    partidas: 0
  }

  //Sesion en el storage
  private readonly STORAGE_KEY = 'misDatos';

  guardarDatos(datos: Usuario): void
  {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datos));
  }

  obtenerDatos(): Usuario
  {
    const datosString = localStorage.getItem(this.STORAGE_KEY);
    return datosString ? JSON.parse(datosString) : null;
  }

  limpiarDatos(): void
  {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  modificarDatoPuntos(nuevoDato: number): void
  {
    const datosActuales = this.obtenerDatos();

    if (datosActuales)
    {
      datosActuales.puntos = nuevoDato;
      this.guardarDatos(datosActuales);
    }
  }

  modificarPrtidasJugadas(): void
  {
    const datosActuales = this.obtenerDatos();

    if(datosActuales)
    {
      datosActuales.partidas = datosActuales.partidas + 1;
      this.guardarDatos(datosActuales);
    }
  }
 
  async getUsuarios(): Promise<Usuario[] | undefined>
  {
    try
    {
      const resultado = await fetch(this.url);
      const usuarios = resultado.json();
      console.log("Los users son: ", usuarios);
      return usuarios;
    }catch(error) 
    {
      console.log(error);  
    }

    return undefined;
  }

  async actualizarPartidasJugadas()
  {
    const cambiar = 
    {
      partidas: this.obtenerDatos().partidas + 1 
    };
    this.modificarPrtidasJugadas();

    const url = "http://localhost:3000/users/" + this.obtenerDatos().id;

    const options = 
    {
      method: 'PATCH',
      headers: 
      {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cambiar),
    }

    fetch(url, options)
    .then(response => 
    {
      if(response.ok) 
      {
        console.log('las partidas del usuario han sido actualizados con éxito.');
      }else 
      {
        console.error('Error al actualizar las partidas del usuario.');
      }
    })
    .catch(error => 
    {
      console.error('Hubo un error en la solicitud:', error);
    });
  }

  async actualizarPuntos( nuevosPuntos: number)
  {
    this.modificarDatoPuntos(nuevosPuntos);
    const aCambiar = 
    {
      puntos: nuevosPuntos
    };

    const url = "http://localhost:3000/users/" + this.obtenerDatos().id;

    const options = 
    {
      method: 'PATCH',
      headers: 
      {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aCambiar),
    }

    fetch(url, options)
    .then(response => 
    {
      if(response.ok) 
      {
        console.log('Los puntos del usuario han sido actualizados con éxito.');
      }else 
      {
        console.error('Error al actualizar los puntos del usuario.');
      }
    })
    .catch(error => 
    {
      console.error('Hubo un error en la solicitud:', error);
    });
  }

  getUltimoID(): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(data =>
      {
        const pos = data.length - 1;
        resolve(data[pos].id);
      })
      .catch(error =>
      {

        console.error("Error en getUltimoID", error);
        reject(error);
      })
    });
  }

  async guardarPartidaHistorial(puntos: number, incorrectas: number, correctas: number, pistaUsada: number, fechaPartida: Date)
  {
    console.log("Los datos partida son:",
    "idUser: ", this.obtenerDatos().id,
    "puntos: ", puntos,
    "incorrectas: ", incorrectas,
    "correctas: ", correctas,
    "pistaUsada: ", pistaUsada,
    "fechaPartida: ", fechaPartida
    );

    const agregar =
    {
      idUsuario: this.obtenerDatos().id,
      puntos: puntos,
      incorrectas: incorrectas,
      correctas: correctas,
      pistaUsada: pistaUsada,
      fechaPartida: fechaPartida
    };

    const url = "http://localhost:3000/partida";

    const options = 
    {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agregar),
    }

    fetch(url, options)
    .then(response => 
    {
      if (response.ok) 
      {
        console.log('Partida guardada con éxito.');
      }else 
      {
        console.error('Error al guardar partida.');
      }
    })
    .catch(error => 
    {
      console.error('Hubo un error en la solicitud:', error);
    });
  }

  async getPartidaUsuario(): Promise<Partida[] | undefined>
  {
    var partidass:Partida[]=[];
    try
    {
      const resultado = await fetch(this.urlPartida);
      const partidas = resultado.json(); 
      for(const ele of await partidas)
      {
        if(ele.idUsuario === this.obtenerDatos().id)
        {
          partidass.push(ele);
        }
      }
      return partidass;
    }catch(error) 
    {
      console.log(error);  
    }

    return undefined;
  }
  
}
