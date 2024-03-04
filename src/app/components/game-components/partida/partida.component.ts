import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TemporizadorComponent } from '../temporizador/temporizador.component';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { CantFotosService } from 'src/app/servicios/cant-fotos.service';
import { JuegoInt } from 'src/app/interfaces/juego-int';

enum valores
{
  //Valores pistas estrategicas
  eliminaOp = 50,
  imgP = 25,
  jump = 25,

  //Valores pistas del juego
  consola = 10,
  genero = 15,
  fecha = 5,

  //Puntos por acertar y Fallar respectivamente
  acierto = 50,
  fallo = 25,

  //Tiempo sobrante del cual se calcula los puntos extra al final de la partida
  tiempoSobrante = 1,
}

@Component
({
  selector: 'app-partida',
  templateUrl: './partida.component.html',
  styleUrls: ['./partida.component.css']
})

export class PartidaComponent implements OnInit
{
  @ViewChild(TemporizadorComponent) temporizador!: TemporizadorComponent;
  @ViewChild(MenuComponent) menuPrincipal!: MenuComponent;

  cartelAdvertenciaNuevito: boolean = false;

  contBloqueoPistaSaltar: number = 0;
  topeFotos: number = this.cantFotosService.topeFotos;


  async abandonarPartida()
  {
    if(this.temporizador)
    {
      await this.usuariosService.actualizarPuntos(this.puntaje);
      this.temporizador.reiniciarTempo();
      this.mostrarYocultar("fotoA",false);
      this.cartelFinal = false;
      this.enviarDatos('finalizar');
    }
  }

  // Función de Abandonar Partida que llama a la función pausaTemporizador() del componente Temporizador
  pausaTemporizadorAux()
  {
    if(this.temporizador)
    {
      this.temporizador.pausaTemporizador();
    }
  }

  //Funcion que llama a playTemporizador() del componente temporizador
  playTemporizadorAux()
  {
    if(this.temporizador)
    {
      this.temporizador.playTemporizador();
    }
  }

  //Envia a componente tipo-Partida
  @Output() mensajeEnviado: EventEmitter<string> = new EventEmitter<string>();

  //Recibe de componente tipo-Partida los datos de los juegos
  @Input() juegos: JuegoInt[] = [];

  //Envia al temporizador para cortar el timepo
  terminar: boolean = true;

  //Carga los puntos del usuario en sesion
  puntaje: number = this.usuariosService.obtenerDatos().puntos;

  puntosExtra: number = 0;

  //Controlador de inicio y fin
  empezar: boolean = false;

  //Controlador de inicio, fin y advertencia
  cartelInicio: boolean = true;
  cartelFinal: boolean = false;
  cartelAdvertencia: boolean = false;

  //Contador del arreglo de juegos
  contJuego: number = 0;

  //Respuestas correctas y incorrectas
  correctas: JuegoInt[] = [];
  incorrectas: JuegoInt[] = [];

  //Contador de uso de pistas
  pistaUsos: number = 0;

  //Control estados de las pistas
  eliminaOp: boolean = false; 
  imgP: boolean = false;
  consola: boolean = false;
  genero: boolean = false;
  fecha: boolean = false;

  //Link a la imagen
  src: string = "";

  constructor(private usuariosService: UsuariosService, private cantFotosService: CantFotosService)
  {
  }

  ngOnInit()
  {
    this.chequeoCosto();
  };

  iniciarPartida()
  {
    this.cartelInicio = false;
    this.empezar = true;
    this.src = this.juegos[this.contJuego].foto;
    this.mostrarYocultar("fotoA", true);
    this.generarValoresAleatoriosImagen();
  }

  async finalizarPartida()
  {
    await this.usuariosService.guardarPartidaHistorial(this.puntaje, this.incorrectas.length, this.correctas.length, this.pistaUsos, new Date());
    this.mostrarYocultar("fotoA", false);
    this.cartelFinal = false;
    this.enviarDatos('finalizar');
  }

  async empezarOtra()
  {
    await this.usuariosService.guardarPartidaHistorial(this.puntaje, this.incorrectas.length, this.correctas.length, this.pistaUsos, new Date());
    this.cartelFinal = false;
    this.enviarDatos('otra');
  }

  //Envia al componente padre
  enviarDatos(mensaje: string)
  {
    this.mensajeEnviado.emit(mensaje);
  }
  

  // -------------- FUNCIONES QUE SE ENCARGAN DE MANEJAR LAS OPCIONES -------------- //

  //Funcion que se encarga del manejo de respuestas
  async handleOptionButtonClick(optionText: string): Promise<void>
  { 
    //Si se ecnuentra en la anteultima foto bloquea la pista de 
    //saltear imagen
    if(this.contBloqueoPistaSaltar === (this.topeFotos -1)) 
    {
      const boton = document.getElementById("jump");
      if(boton)
      {
        (boton as HTMLButtonElement).disabled = true;
        boton.style.background = 'red';
      }
    }

    let resp: boolean;
    this.reset();

    //Suma o resta puntos dependiendo de la respuesta
    if(optionText == this.juegos[this.contJuego].nombre)
    {
      this.correctas.push(this.juegos[this.contJuego]);
      this.sumarPuntos(valores.acierto);
      resp = true;
    }else
    {
      this.incorrectas.push(this.juegos[this.contJuego]);
      this.restarPuntos(valores.fallo);
      resp = false;
    }

    this.memeRespuesta(resp);
    this.contBloqueoPistaSaltar++;

    //Bloquea el boton "Saltear foto" al llegar al final
    if(this.contBloqueoPistaSaltar === this.topeFotos) 
    {
      const boton = document.getElementById("jump");
      if(boton)
      {
        (boton as HTMLButtonElement).disabled = true;
        boton.style.background = 'rgba(172, 255, 47, 0.784)';
      }
    }

    this.desabilitarYhablitarAllBoton(true);  
  
    await new Promise<void>((resolve) => setTimeout(() =>
    {
      if(this.contBloqueoPistaSaltar === this.topeFotos)
      {
        this.terminar = false;
      }else
      {
        this.desabilitarYhablitarAllBoton(false);
        this.juegos.splice(this.contJuego, 1);
        this.moverPorArreglo();
      } 
      resolve(); // Resolve la promesa para continuar la ejecución

    }, 2000));
  }
  
  //Recorre el arreglo de juegos
  moverPorArreglo()
  {
    if(this.contJuego >= (this.juegos.length-1))
    {
      this.contJuego = 0;
    }else
    {
      this.contJuego = this.contJuego + 1;
    }
    this.generarValoresAleatoriosImagen();
    this.src = this.juegos[this.contJuego].foto;
  }

  reset()
  {
    //Reseteo el corte de la imagen
    this.generarValoresAleatoriosImagen();
    
    //Oculto las pistas
    const elementosConClase = document.querySelectorAll('.VP');
    elementosConClase.forEach((elemento) =>
    {
      (elemento as HTMLElement).style.visibility = 'hidden'; 
    });

    //Habilito los botones de opciones devuelta
    const elementosConClase2 = document.querySelectorAll('.option');
    elementosConClase2.forEach((elemento) =>
    {
      (elemento as HTMLButtonElement).disabled = false;
      (elemento as HTMLButtonElement).style.background = '#0073ff';
    });

    this.desabilitarYhablitarBoton('eliminaOp',false);
    //Reseteo los valores para chequear las pistas
    this.eliminaOp = false;
    this.imgP = false;
    this.consola = false;
    this.genero = false;
    this.fecha = false;
  }

  sumarPuntos(puntos: number)
  {
    this.puntaje = this.puntaje + puntos;
    this.chequeoCosto(); 
  }

  restarPuntos(puntos: number)
  {
    if(this.puntaje >= puntos)
    {
      this.puntaje = this.puntaje - puntos;
    }
    this.chequeoCosto(); 
  }

  desabilitarYhablitarAllBoton(estado: boolean)
  {
    const elementos = document.querySelectorAll('.bloquear');
    elementos.forEach((elemento) =>
    {
      (elemento as HTMLButtonElement).disabled = estado;
    });

    if(this.contBloqueoPistaSaltar === (this.topeFotos - 1)) 
    {
      const boton = document.getElementById("jump");
      if(boton)
      {
        (boton as HTMLButtonElement).disabled = true;
        boton.style.background = 'red'; 
      }
    }
  }
  
  desabilitarYhablitarBoton(boton: string, estado: boolean)
  {
    const miBoton = document.getElementById(boton) as HTMLButtonElement;
    if(miBoton)
    {
      miBoton.disabled = estado;
      if(estado)
      {
        miBoton.style.background ='red';
      }else
      {
        miBoton.style.background ='rgba(172, 255, 47, 0.784)';
      }
    }
  }
  
  verificarPistas(clase: string)
  {
    let usada: boolean = false;
    const elementosConClase = document.querySelectorAll(clase);
    elementosConClase.forEach((elemento) =>
    {
      if((elemento as HTMLButtonElement).disabled)
      {
        usada  = true;
      }
    });
    return usada;
  }

  chequeoCosto()
  {
    const elementosConClase = document.querySelectorAll(".pista");
    elementosConClase.forEach((elemento) =>
    {
      switch(elemento.id)
      {
        case 'eliminaOp':

          if(this.puntaje < valores.eliminaOp || this.eliminaOp)
          {
            this.desabilitarYhablitarBoton(elemento.id, true);
          }else
          {
            this.desabilitarYhablitarBoton(elemento.id, false);
          }

        break;

        case 'imgP':

          if(this.puntaje < valores.imgP || this.imgP)
          {

            this.desabilitarYhablitarBoton(elemento.id, true);
          }else
          {
            this.desabilitarYhablitarBoton(elemento.id, false);
          }

        break;

        case 'jump':

          if(this.contBloqueoPistaSaltar === (this.topeFotos - 1))
          {
            let boton = document.getElementById("jump");
            if(boton)
            {
              (boton as HTMLButtonElement).disabled = true;
              boton.style.background = 'red';
            }

          }else if(this.puntaje < valores.jump)
          {

            this.desabilitarYhablitarBoton(elemento.id, true);
          }else
          {
            this.desabilitarYhablitarBoton(elemento.id, false);
          }

        break;

        case 'consola':

          if(this.puntaje < valores.consola || this.consola)
          {
            this.desabilitarYhablitarBoton(elemento.id, true);
          }else
          {
            this.desabilitarYhablitarBoton(elemento.id, false);
          }

        break;

        case 'fecha':

          if(this.puntaje < valores.fecha || this.fecha)
          {
            this.desabilitarYhablitarBoton(elemento.id,true);
          }else
          {
            this.desabilitarYhablitarBoton(elemento.id, false);
          }

        break;

        case 'genero':

          if(this.puntaje < valores.genero || this.genero)
          {
            this.desabilitarYhablitarBoton(elemento.id, true);
          }else
          {
            this.desabilitarYhablitarBoton(elemento.id, false);
          }

        break;
      }
    })
  }

  //Funcion que genera una figura random que tapa la imagen
  generarValoresAleatoriosImagen()
  {
    var clipPathValue = "";
    let num = Math.floor(Math.random() * 11);

    switch(num)
    {
      case 0 :
        clipPathValue = "polygon(100% 0, 90% 0, 100% 100%, 100% 10%, 0 100%, 10% 100%, 0 0, 0 90%)";
      break;

      case 1 :
        clipPathValue = "polygon(0 35%, 90% 0, 0 100%, 100% 65%, 10% 100%, 100% 0)";
      break;

      case 2 :
        clipPathValue = "circle(20.0% at 21% 21%)";
      break;

      case 3 :
        clipPathValue = "polygon(5% 0, 0 5%, 45% 50%, 0 95%, 5% 100%, 50% 55%, 95% 100%, 100% 95%, 55% 50%, 100% 5%, 95% 0, 50% 45%)";
      break;

      case 4 :
        clipPathValue = "polygon(50% 85%, 100% 0, 50% 100%, 0 0)";
      break;

      case 5 :
        clipPathValue = "polygon(50% 0%, 55% 45%, 98% 35%, 55% 55%, 79% 91%, 50% 60%, 21% 91%, 45% 55%, 2% 35%, 45% 45%)";
      break;

      case 6 :
        clipPathValue = "polygon(0% 0%, 0% 100%, 10% 100%, 10% 10%, 90% 10%, 90% 90%, 0 90%, 0 100%, 100% 100%, 100% 0%)";
      break;

      case 7 :
        clipPathValue = "polygon(40% 0%, 10% 45%, 100% 45%, 100% 55%, 10% 55%, 40% 100%, 0% 50%)";
      break;

      case 8 :
        clipPathValue = "polygon(0 45%, 90% 45%, 60% 0%, 100% 50%, 60% 100%, 90% 55%, 0 55%)";
      break;

      case 9 :
        clipPathValue = "polygon(50% 25%, 100% 0, 75% 0, 100% 100%, 100% 75%, 50% 0, 0 75%, 0 100%, 25% 0, 0 0)";
      break;

      case 10 :
        clipPathValue = "ellipse(10% 20% at 50% 25%)";
      break;
    }

    const foto = document.getElementById('fotoA');
    if(foto)
    {
      foto.style.clipPath = clipPathValue; 
    }
  }
  

  // -------------- FUNCIONES QUE SE ENCARGAN DE MANEJAR LAS PISTAS -------------- //

  //Funcion que se encaarga de manejar los botones de las pistas de texto
  handlePistaButtonClick(buttonText: string): void
  {
    switch(buttonText)
    {
      case 'consola':
        this.consola = true;
        this.mostrarPista('VP1', valores.consola);
      break;

      case 'fecha':
        this.fecha = true;
        this.mostrarPista('VP3', valores.fecha);
      break;
      
      case 'genero':
        this.genero = true;
        this.mostrarPista('VP4', valores.genero);
      break;
    }
  }

  pistaEliminaOp()
  {
    let i: number = 0;
    while(i < 2)
    {
      let np: number = Math.floor(Math.random() * 4);

      if(this.juegos[this.contJuego].nombresOpciones[np] != this.juegos[this.contJuego].nombre)
      {
        const miBoton = document.getElementById('opcion' + np) as HTMLButtonElement;
        if(miBoton && !miBoton.disabled)
        {
          this.desabilitarYhablitarBoton('opcion' + np, true)
          i = i + 1;
        }
      }
    }
    this.eliminaOp = true;
    this.restarPuntos(valores.eliminaOp);
  }

  fotoCompleta()
  {
    const foto = document.getElementById('fotoA');
    if(foto)
    {
      foto.style.clipPath = "none";
    }
    this.imgP = true;
    this.restarPuntos(valores.imgP);
  }

  saltarFoto()
  {
    if(this.verificarPistas('.pista') && this.puntaje >= 25)
    {
      this.pausaTemporizadorAux();
      this.cartelAdvertencia=true; 
    }
    else
    {
      this.moverPorArreglo();
      this.generarValoresAleatoriosImagen();
      this.restarPuntos(valores.jump);
    }
  }
  
  saltarFotoPerdiendoPuntos()
  {
    this.reset();
    this.moverPorArreglo();
    this.cartelAdvertencia = false
    this.restarPuntos(valores.jump);
  }

  mostrarPista(id:string,coste:number)
  {
    const pista = document.getElementById(id);
    if(pista)
    {
      pista.style.visibility = 'visible';
    }
    this.restarPuntos(coste);
  }

  mostrarYocultar(id:string,estado:boolean)
  {
    const pista = document.getElementById(id);
    if(pista)
    {
      if(estado)
      {
        pista.style.visibility = 'visible';
      }else
      {
        pista.style.visibility = 'hidden';
      }
    }
  }

  //Suma 1 cada vez que se usa una pista al contador "pistaUsos"
  usoPista()
  {
    this.pistaUsos = this.pistaUsos + 1;
  }

  //Reproduce un gif dependiendo si la respuesta es
  //correcta o incorrecta
  memeRespuesta(resp: boolean)
  {
    const foto = document.getElementById('fotoA');
    if(foto)
    {
      foto.style.clipPath = "none";
    }

    if(resp == false)
    {
      if(this.puntaje < 25)
      {
        this.src = "assets/DiCaprioIncorrectaSinPuntos.gif"
      }else
      {
        this.src = "assets/DicaprioIncorrectaGIF.gif"
      }
    }else
    {
      this.src = "assets/DicaprioCorrectaGIF.gif";
    }
  }
  
  //Recibe datos desde el componente "Temporizador"
  // y actualiza los puntos totales en el servidor
  async recibindoDatosDesdeTemporizador(mensaje: string)
  {
    this.puntosExtra = Number(mensaje) * valores.tiempoSobrante;
    this.puntaje = this.puntaje + this.puntosExtra;
    await this.usuariosService.actualizarPartidasJugadas();
    await this.usuariosService.actualizarPuntos(this.puntaje);
    this.cartelFinal = true;
  }
}
