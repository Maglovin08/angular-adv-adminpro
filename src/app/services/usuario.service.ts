import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


import { map, pipe, tap, Observable, catchError, of } from 'rxjs';

import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient,
              private router: Router) { }

public usuario!: Usuario;

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

  validarToken(): Observable<boolean>{
    return this.http.get(`${base_url}/login/renew`,{
      headers:{
        'x-token':this.token
      }
    }).pipe(
      map((resp:any) => {
        const {email, google, nombre, role, uid, img = ''} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '',img, google, role, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
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

  actualizarPerfil( data: { email:string, nombre:string, role: string }){

   data = {
     ...data,
     role: this.usuario.role || ''
   };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)

  }

  login( formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap((resp:any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
    
  }

  cargarUsuarios( desde: number = 0 ){

    const url = `${base_url}/usuarios?desde=${ desde }`
    return this.http.get<CargarUsuario>( url, this.headers )
              .pipe(
                map( resp => {
                  const usuarios = resp.usuarios.map( 
                      user => new Usuario(user.nombre, user.email, '', user.img, user.role,user.uid,user.google)
                      );
                    return{
                      total: resp.total,
                      usuarios
                    }
                })
              )
  }

 eliminarUsuario( usuario: Usuario ){
   const url = `${base_url}/usuarios/${ usuario.uid }`;
   return this.http.delete( url, this.headers );
 }

 guardarUsuario( usuario: Usuario ){

  // data = {
  //   ...data,
  //   role: this.usuario.role || ''
  // };

   return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)

 }

}
