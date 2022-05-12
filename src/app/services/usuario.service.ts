import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, pipe, tap, Observable, catchError, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient,
              private router: Router) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || "";

    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':token
      }
    }).pipe(
      tap((resp:any) => {
        localStorage.setItem('token', resp.token)
      }),
      map(resp => true),
      catchError( error => of(false))
    );
  }

  crearUsuario( formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap((resp:any) => {
                    localStorage.setItem('token', resp.token)
                  }),
                  map( resp => true)
                );
  }

  login( formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap((resp:any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
    
  }
}
