import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component
({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit
{
  iniciarSesionCuenta: boolean = true;
  noTienesCuenta: boolean = true;

  crearCuentaSesion: boolean = false;
  volverAIniciar: boolean = false;

  login!: FormGroup; 
  creacion!: FormGroup;

  usuarioLogueado: Usuario = 
  { 
    id: 0,
    usuario: "",
    password: "",
    puntos: 0,
    partidas: 0
  };

  
  constructor(private router: Router, private usuariosService: UsuariosService, private readonly fb: FormBuilder)
  {

  }

  initFormLogin(): FormGroup 
  {
    return this.fb.group
    ({
      Usuario: ['', Validators.required,],
      Password: ['', Validators.required,]
    })
  }

  initFormCreacion(): FormGroup 
  {
    return this.fb.group
    ({
      UsuarioNuevo: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      PasswordNuevo: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]]
    });
  }

  ngOnInit()
  {
    this.login = this.initFormLogin();
    this.creacion = this.initFormCreacion();
  }

  cambiarDeModoInicio()
  {
    if(this.iniciarSesionCuenta)
    {
      this.iniciarSesionCuenta = false;
      this.noTienesCuenta = false;

      this.crearCuentaSesion = true;
      this.volverAIniciar = true;
    }else
    {
      this.iniciarSesionCuenta = true;
      this.noTienesCuenta = true;

      this.crearCuentaSesion = false;
      this.volverAIniciar = false;
    }
  }

  //Funcion de guardar los datos de usuario
  async logueo_Usuario()
  {
    const usuarioL = (<HTMLInputElement>document.getElementById("Usuario")).value;
    const pass = (<HTMLInputElement>document.getElementById("Password")).value;

    const validado = await this.validarUsuario(usuarioL, pass, 1);

    if(validado)
    {
      this.usuariosService.guardarDatos(this.usuarioLogueado);
      this.router.navigate(['/menu']);
    }else
    {
      var mensaje = document.getElementById("txt_login");
      if(mensaje)
      {
        mensaje.innerHTML = "Nombre o password incorrecto"
      }
    }
  }

  //Funcion de Crear User nuevo y guardar los datos
  async creacion_Usuario()
  {
    const nombreCre = (<HTMLInputElement>document.getElementById("UsuarioNuevo")).value;
    const passCre = (<HTMLInputElement>document.getElementById("PasswordNuevo")).value;
    const confPassword = (<HTMLInputElement>document.getElementById("PasswordConfirm")).value;

    if(nombreCre.length >= 8 && nombreCre.length <= 15)
    {
      if((passCre.length >= 8 && passCre.length <= 25) && (confPassword.length >= 8 && confPassword.length <= 25))
      {
        if(passCre !== confPassword)
        {
          let mensaje = document.getElementById("texto");
          if(mensaje)
          {
            mensaje.innerHTML = "Los passwords no coinciden";
          }
        }else if(passCre === confPassword)
        {
          let validacion = await this.validarUsuario(nombreCre, passCre, 0);

          if(validacion)
          {
            //Si el usuario ya existe crea un mensaje
            var mensaje = document.getElementById("texto");
            this.usuarioLogueado =
            { 
              id: 0,
              usuario: "",
              password: "",
              puntos:0,
              partidas: 0
            };

            if(mensaje)
            {
              mensaje.innerHTML = "Nombre de Usuario ya en uso";
            }
          }else
          {
            //Aca sube los datos al server
            await this.cargarUsuario(nombreCre, passCre);

            //NUEVO AL CREAR
            this.usuariosService.guardarDatos(this.usuarioLogueado);
            this.usuariosService.login = this.usuarioLogueado;
            this.router.navigate(['/menu']);
          }
        }else
        {
          var mensaje = document.getElementById("texto");
          if(mensaje)
          {
            mensaje.innerHTML = "ERROR";
          }
        }
      }else
      {
        let mensaje = document.getElementById("texto");
        if(mensaje)
        {
          mensaje.innerHTML = "Las password deben tener entre 8 y 25 caracteres";
        }
      }
    }else
    {
      let mensaje = document.getElementById("texto");
      if(mensaje)
      {
        mensaje.innerHTML = "Nombre de Usuario debe tener entre 8 y 15 caracteres";
      }
    }
  }

  async cargarUsuario(nombre: string, password: string)
  { 
    let idnuevo: number = await this.usuariosService.getUltimoID();
    console.log("idNuevo: ", idnuevo);
    idnuevo = idnuevo + 1; 
    console.log("idNuevo con suma: ", idnuevo);

    const update: Usuario = 
    {
      id: idnuevo,
      usuario: nombre,
      password: password,
      puntos: 200,
      partidas:0
    };

    const options = 
    {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    }

    fetch("http://localhost:3000/users", options)
    .then(data => data)
    .then(update =>
    {
      console.log("Usuario Cargado correctamente")
    })
    .catch(e =>
    {
      console.log(e);
    });

    this.usuarioLogueado = update; 
  }

  async validarUsuario(nombre: string, contra: string, tipo: number)
  {
    var validacion: boolean = false;
    const servidor = "http://localhost:3000/users";
  
    try
    {
      const response = await fetch(servidor);
      const json = await response.json();
  
      for(const datos of json)
      {
        if(datos.usuario === nombre)
        {
          if(tipo == 0)
          {
            this.usuarioLogueado = 
            { 
              id: datos.id,
              usuario: nombre,
              password: "",
              puntos: datos.puntos,
              partidas: datos.partidas
            };

            validacion = true;
          }
          
          if(datos.password === contra)
          {
            this.usuarioLogueado = 
            { 
              id: datos.id,
              usuario: nombre,
              password: "",
              puntos: datos.puntos,
              partidas: datos.partidas
            };

            validacion = true;
          }
        }
      }
    }catch(error)
    {
      console.error("Error al obtener datos del servidor", error);
    }
  
    return validacion;
  }

}
