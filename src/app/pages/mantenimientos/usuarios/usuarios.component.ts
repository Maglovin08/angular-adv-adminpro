import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { Subscription, delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {
  
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs!: Subscription;

  public desde: number = 0;
  public cargando: boolean = true;


  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {

    this.cargarUsuario();

  }

  cargarUsuario() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( ({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;


    })
  }

  cambiarPagina( valor:number ){
    this.desde += valor;
  
    if( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsuarios){
      this.desde -= valor; 
    }

    this.cargarUsuario();

  }

  buscar( termino: string) {

    if ( termino.length === 0 ) {
      return  this.usuarios = this.usuariosTemp;

    }

    this.busquedasService.buscar('usuarios', termino)
              .subscribe( resultados=> {
                this.usuarios = resultados as Usuario[];
              });
  }
  eliminarUsuario( usuario: Usuario ){

   if (usuario.uid === this.usuarioService.uid) {
     return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp =>
           {
            this.cargarUsuario();
            Swal.fire(
            'Usuario borrado',
            `El  ${ usuario.nombre } ha sido eliminado`,
            'success'
          )
        })
      }
    })
  }

  cambiarRole(usuario:Usuario){
    this.usuarioService.guardarUsuario(usuario)
        .subscribe( resp => {
          console.log(resp);

        })
  }

  abrirModal(usuario: Usuario){

    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);

  }
 
}
