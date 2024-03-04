import { Injectable } from '@angular/core';

@Injectable
({
  providedIn: 'root'
})

export class LlamadaApiService
{
  datosJuegos: any[] = [];
  nombresJuegos: string[] = [];

  constructor()
  {
    
  }

  getNombresJuegosAPI(i: number, genero: string): Promise<void>
  {
    return new Promise((resolve, reject) =>
    {
      let arregloDeNombres: string[] = [];

      let nombresURL;
      switch(genero)
      {
        case "porDefecto":
          nombresURL = "https://api.rawg.io/api/games?key=9c7f75a955784bf9aa646f60ad51102b&page_size=40&page=" + i;
        break;

        default:
          nombresURL = "https://api.rawg.io/api/games?key=9c7f75a955784bf9aa646f60ad51102b&page_size=40&page=" + i + "&genres=" + genero;
        break;
      }

      fetch(nombresURL)
      .then(res => res.json())
      .then(data =>
      {
        for(const juego of data.results)
        {
          arregloDeNombres.push(juego.name);
        }

        this.nombresJuegos = arregloDeNombres;  
        resolve(); // Resuelve la promesa una vez que los nombres se han cargado
      })
      .catch(error =>
      {
        console.error("Error en el primer fetch:", error);
        reject(error);
      });
    });
  }

  //Crea un arreglo de tipo Juego con todos los datos de la API
  cargarArregloJuegos(data: any)
  {
    class Juego
    {
      // Atributos
      nombre: string;
      foto: string;
      fecha: string;
      generos: string[];
      plataformas: string[];
      nombresOpciones: string[];
      visible: boolean;
    
      // Constructor
      constructor(nombre: string, foto: string, fecha: string, generos: string[], plataformas: string[], nombresOpciones: string[])
      {
        this.nombre = nombre;
        this.foto = foto;
        this.fecha = fecha;
        this.generos = generos;
        this.plataformas = plataformas;
        this.nombresOpciones = nombresOpciones;
        this.visible = true;
      }
    }

    let arregloDeJuegos: Juego[] = [];

    for(const juego of data.results)
    {

      //Carga nombre Juego
      const nuevoNombre: string = juego.name;

      //Carga URL fotos en un arreglo auxiliar
      const nuevasFotos: string[] = [];
      for(const unaFoto of juego.short_screenshots)
      {
        nuevasFotos.push(unaFoto.image);
      }
      
      //seleciono dentro del arreglo
      let posRandom = Math.floor(Math.random() * nuevasFotos.length);
      
      //Cargo esa URL random valida en nuevaFoto
      const nuevaFoto: string = nuevasFotos[posRandom];
      //Precarga la foto
      var img = new Image();
      img.src = nuevasFotos[posRandom];

      //Carga la fecha del juego
      const nuevaFecha: string = juego.released;

      //Carga los generos del juego
      const nuevosGeneros: string[] = [];
      for(const unGenero of juego.genres)
      {
        let nuevoGenero;
        switch(unGenero.name)
        {
          case 'Action':
            nuevoGenero = 'Accion';
          break;

          case 'Indie':
          case 'RPG':
          case 'Shooter':
          case 'Casual':
          case 'Puzzle':
          case 'Arcade':
            nuevoGenero = unGenero.name;
          break;

          case 'Adventure':
            nuevoGenero = 'Aventura';
          break;

          case 'Strategy':
            nuevoGenero = 'Estrategia';
          break;

          case 'Simulation':
            nuevoGenero = 'Simulacion';
          break;

          case 'Platformer':
            nuevoGenero = 'Plataformas';
          break;

          case 'Massively Multiplayer':
            nuevoGenero = 'Multijugador masivo';
          break;

          case 'Racing':
            nuevoGenero = 'Carreras';
          break;

          case 'Sports':
            nuevoGenero = 'Deportes';
          break;

          case 'Fighting':
            nuevoGenero = 'Lucha';
          break;

          case 'Family':
            nuevoGenero = 'Familiar';
          break;

          case 'Board Games':
            nuevoGenero = 'Juegos de Mesa';
          break;

          case 'Educational':
            nuevoGenero = 'Educativos';
          break;

          case 'Card':
            nuevoGenero = 'De Cartas';
          break;

          default:
            nuevoGenero = unGenero.name;
          break;
        }
        nuevosGeneros.push(nuevoGenero);
      }

      //Carga las plataformas del juego, evita cargar plataformas repetidas
      const nuevasPlataformas: string[] = [];
      for(const unaPlataforma of juego.platforms)
      {
        const nombreDeLaPlataforma = unaPlataforma.platform.name;
        if(nombreDeLaPlataforma == 'macOS' || nombreDeLaPlataforma == 'Linux')
        {
          let existe = nuevasPlataformas.includes('PC')
          if(existe == false)
          {
            nuevasPlataformas.push('PC');
          }
        }else
        {
          let existe = nuevasPlataformas.includes(nombreDeLaPlataforma)
          if(existe == false)
          {
            nuevasPlataformas.push(nombreDeLaPlataforma);
          }
        }
      }

      //Del arreglo nombres, cambia el orden de los datos, de manera que pese a que
      //siempre cargue las posiciones 0, 1, 2 y 3. Los datos seran siempre al azar
      function randomizarNombres(arregloNombres: string[])
      {
        for(let i = arregloNombres.length - 1; i > 0; i--)
        {
          const j = Math.floor(Math.random() * (i + 1));
          [arregloNombres[i], arregloNombres[j]] = [arregloNombres[j], arregloNombres[i]];
        }
      }
      // agrego las otras opciones
      const nuevosNombresOpciones = [];
      randomizarNombres(this.nombresJuegos);
      nuevosNombresOpciones.push(this.nombresJuegos[0]);
      nuevosNombresOpciones.push(this.nombresJuegos[1]);
      nuevosNombresOpciones.push(this.nombresJuegos[2]);
      nuevosNombresOpciones.push(this.nombresJuegos[3]);

      //Sobreescribo una posicion random por el nombre real del juego.
      const randomNum = Math.floor(Math.random() * 4);
      nuevosNombresOpciones[randomNum] = nuevoNombre;

      const nuevoJuego = new Juego
      (
        nuevoNombre,
        nuevaFoto,
        nuevaFecha,
        nuevosGeneros,
        nuevasPlataformas,
        nuevosNombresOpciones
      );
      arregloDeJuegos.push(nuevoJuego);
    }
    return arregloDeJuegos;
  }
  
  //Llama a la API y retorna el arreglo de juegos
  getJuegosAPI(i: number, genero: string, cantFotos: number): Promise<any[]>
  {
    return new Promise((resolve, reject) =>
    {
      //Primero, espera a que se carguen los nombres
      this.getNombresJuegosAPI(i, genero)
      .then(() =>
      {
        //Ahora que los nombres están disponibles, carga los juegos
        let API_Juegos;
        switch (genero)
        {
          case 'porDefecto':
            API_Juegos = "https://api.rawg.io/api/games?key=9c7f75a955784bf9aa646f60ad51102b&page_size=" + cantFotos + "&page=" + i;
          break;

          default:
            API_Juegos = "https://api.rawg.io/api/games?key=9c7f75a955784bf9aa646f60ad51102b&page_size=" + cantFotos + "&page=" + i + "&genres=" + genero;
          break;
        }
        
        fetch(API_Juegos)
        .then(res => res.json())
        .then(data =>
        {
          let arregloDeJuegos: any[] = [];
          arregloDeJuegos = this.cargarArregloJuegos(data);
          //Resuelve la promesa con el arreglo de juegos cargados
          resolve(arregloDeJuegos);
        })
        .catch(error =>
        {
          console.error("Error en el segundo fetch:", error);
          reject(error);
        });
      })
      .catch(error =>
      {
        console.error("Error en el primer fetch:", error);
        reject(error);
      });
    });
  }

  //Llama a getJuegos cargando el arreglo "datosJuegos"
  async crearPartida(genero: string, dificultad:string, cantFotos: number)
  {
    try
    {
      let numeroRandom: number;
      switch(dificultad)
      {
        case 'modoNormal':
          numeroRandom = Math.floor(Math.random() * 25) + 1;
        break;

        case 'modoMedio':
          numeroRandom = Math.floor(Math.random() * 50) + 1;
        break;

        default:
          //numeroRandom = Math.floor(Math.random() * 200) + 1;
          numeroRandom = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        break;
      }

      //Obtiene los juegos
      this.datosJuegos = await this.getJuegosAPI(numeroRandom, genero, cantFotos); 
      
    }catch(error)
    {
      console.error("Error al obtener juegos y redirigir:", error);
    }
  }
}
