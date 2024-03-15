import { Component, OnInit } from '@angular/core';

@Component
({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit
{
  anioActual: number = 0;

  ngOnInit(): void
  {
    const fechaActual = new Date();
    this.anioActual = fechaActual.getFullYear(); 
  }
}
