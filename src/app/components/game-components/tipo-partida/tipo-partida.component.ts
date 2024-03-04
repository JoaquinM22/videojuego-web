import { Component, EventEmitter, Output } from '@angular/core';
import { CantFotosService } from 'src/app/servicios/cant-fotos.service';
import { LlamadaApiService } from 'src/app/servicios/llamada-api.service';
import { TiempoTemporizadorService } from 'src/app/servicios/tiempo-temporizador.service';

@Component
({
  selector: 'app-tipo-partida',
  templateUrl: './tipo-partida.component.html',
  styleUrls: ['./tipo-partida.component.css']
})

export class TipoPartidaComponent
{
  // Envia al componente de menu
  @Output() mensajeEnviado: EventEmitter<string> = new EventEmitter<string>();
  // Controladores de carteles
  cartelInicio: boolean = true;
  loading: boolean =false;
  //Controlador de comienzo de partida
  empezar: boolean =false;
  //Arreglo de juegos ya filtrados
  datosJuegos: any[] = [];
  // Modalidades del juego
  modoSeleccionado: string = 'modoNormal';
  generoSeleccionado: string = 'porDefecto';
  tiempoSeleccionado: string = 'tresMinutos';
  cantFotosSeleccionado: string = 'diezFotos';


  constructor(private llamadaApi: LlamadaApiService, private minutosService: TiempoTemporizadorService, private topeFotoService: CantFotosService)
  {

  }

  async traerDatosApi()
  {
    this.cartelInicio=false;
    this.loading=true;
    this.establecerTiempo();
    await this.llamadaApi.crearPartida(this.generoSeleccionado,this.modoSeleccionado, this.establecerCantFotos());
    this.datosJuegos=this.llamadaApi.datosJuegos;
    this.loading=false;
    this.empezar=true;
  }

  establecerTiempo()
  {
    switch(this.tiempoSeleccionado)
    {
      case 'tresMinutos':
        this.minutosService.minutos = 3;
        this.minutosService.segundos = 1;
      break;

      case 'dosMinutos':
        this.minutosService.minutos = 2;
        this.minutosService.segundos = 1;
      break;

      default:
        this.minutosService.minutos = 1;
        this.minutosService.segundos = 1;
      break;
    }
  } 

  establecerCantFotos(): number
  {
    switch(this.cantFotosSeleccionado)
    {
      case 'diezFotos':
        this.topeFotoService.topeFotos = 10;
        return 10;
      break;

      case 'veinteFotos':
        this.topeFotoService.topeFotos = 20;
        return 20;
      break;

      default:
        this.topeFotoService.topeFotos = 30;
        return 30;
      break;
    }
  } 

  enviarDatos(mensaje : string)
  {
    this.mensajeEnviado.emit(mensaje);
  }
  
  recibindoDatosDesdeJuego(mensaje: string)
  {
    switch(mensaje)
    {
      case 'otra':
        this.datosJuegos = [];
        this.empezar = false;
        this.cartelInicio = true;
      break;
      case 'finalizar':
        this.enviarDatos('false');
      break;
    }
  }
}
