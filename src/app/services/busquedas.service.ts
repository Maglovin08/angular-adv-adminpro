import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medicos } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:{
        'x-token':this.token
      }
    }
  }

private transformarUsuarios( resultados: any[] ): Usuario[]{
  return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.role,user.uid,user.google)
  );
}
private transformarHospital( resultados: any[] ): Hospital[]{
  return resultados
}

private transformarMedico( resultados: any[] ): Medicos[]{
  return resultados
}

  busquedaGlobal( termino: string) {
    const url = `${ base_url }/todo/${ termino }`;
    return this.http.get( url, this.headers )
  }

  buscar( tipo: 'usuarios' | 'medicos' | 'hospitales',
          termino: string ){

    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
  
    return this.http.get<any[]>( url, this.headers )
                .pipe(
                  map( ( resp:any ) =>{

                    switch ( tipo ) {
                      case 'usuarios':
                        return this.transformarUsuarios( resp.resultados );
                      
                      case 'hospitales':
                        return this.transformarHospital( resp.resultados );

                      case 'medicos':
                        return this.transformarMedico( resp.resultados );
                    
                      default:
                        return [];
                    }
                  })
                );
  }


}


