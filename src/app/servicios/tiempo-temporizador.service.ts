import { Injectable } from '@angular/core';

@Injectable
({
  providedIn: 'root'
})

export class TiempoTemporizadorService
{
  minutos: number = 10;
  segundos: number = 15;

  constructor()
  {

  }
}
