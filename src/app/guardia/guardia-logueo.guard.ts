
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuariosService } from '../servicios/usuarios.service';

@Injectable
({
  providedIn: 'root',
})

export class GuardiaLogueoGuard
{
  constructor(private usuariosService: UsuariosService, private router: Router)
  {

  }

  canActivate
  (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    //Verifica si el usuario esta logueado
    if(localStorage.getItem('misDatos'))
    {
      return true;
    }else
    {
      //Mensaje de que no esta logueado
      alert("Necesita loguearse para usar esta funcion");
      this.router.navigate(['/']); //Redirecciona al inicio
      return false;
    }
  }
}
 