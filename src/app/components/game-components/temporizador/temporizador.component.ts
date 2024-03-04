import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TiempoTemporizadorService } from 'src/app/servicios/tiempo-temporizador.service';

@Component
({
  selector: 'app-temporizador',
  templateUrl: './temporizador.component.html',
  styleUrls: ['./temporizador.component.css']
})

export class TemporizadorComponent
{
  @Output() mensajeEnviado: EventEmitter<string> = new EventEmitter<string>();
  @Input() terminar: boolean = true;

  minutos: number = this.minutosService.minutos;
  segundos: number = this.minutosService.segundos;

  minutosString: String = '00';
  segundosString: String = '00';
  intervalId: any;

  tiempoActual: number = 0;
  tiempoInicio: number = 0;
 
  constructor(private minutosService: TiempoTemporizadorService)
  {  
    this.iniciarTemporizador(this.minutos, this.segundos); 
  }

  enviarDatos(mensaje : string)
  {
    this.mensajeEnviado.emit(mensaje);
  }

  //Función que inicializa el temporizador
  iniciarTemporizador(minutos: number, segundos: number)
  {
    // Asigna los minutos y los segundos
    this.tiempoInicio = minutos * 60000 + segundos * 1000;
    let tiempoTotal = this.tiempoInicio;

    this.continuarTiempo(tiempoTotal);
  }

  continuarTiempo(tiempo: number)
  {
    let tiempoTotal = tiempo;
    //Esta función se ejecutará cada segundo
    const actualizarTemporizador = () =>
    {
      // Reduce el tiempo transcurrido en 1000 milisegundos
      tiempoTotal -= 1000;
      this.tiempoActual = tiempoTotal;

      // Obtiene el tiempo transcurrido en minutos y segundos
      let minutos = Math.floor(tiempoTotal / 60000);
      let segundos = Math.floor(tiempoTotal % 60000 / 1000);

      //Añade un 0 a la izquierda de los segundos y minutos si son de un solo digito
      this.minutosString = minutos < 10 ? '0' + minutos : minutos.toString();
      this.segundosString = segundos < 10 ? '0' + segundos : segundos.toString();

      //Si el tiempo es 0 o termina la partida detiene el temporizador
      if((minutos === 0 && segundos === 0) || !this.terminar)
      {
        this.enviarDatos(String(Number(this.minutosString)*60+Number(this.segundosString)));
        clearInterval(this.intervalId);
        this.tiempoActual = 0;
        this.tiempoInicio = 0;
      }
    }

    // Inicia el temporizador
    this.intervalId = setInterval(actualizarTemporizador, 1000);
  }
 
  // Función que pausa el temporizador
  pausaTemporizador()
  {
    // Borra el intervalo
    clearInterval(this.intervalId);
  }

  // Función que le da play de nuevo
  playTemporizador()
  {
    // Inicia un nuevo intervalo desde donde quedo
    this.continuarTiempo(this.tiempoActual);  
  }

  // Función que lo reinicia para que se pueda volver a usar
  reiniciarTempo()
  {
    clearInterval(this.intervalId);
    this.tiempoActual = 0;
    this.tiempoInicio = 0;   
  }
}
