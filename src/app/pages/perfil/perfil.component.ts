import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUpload: FileUploadService) { 

  this.usuario = usuarioService.usuario;
      
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });

  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
        .subscribe( resp => {
          const { nombre, email } = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;
          Swal.fire('Usuario actualizado', 'Cambios fueron guardados', 'success')

        }, (err)=>{
          Swal.fire('Error', err.error.msg, 'error')
        })
  }

  cambiarImagen( event: any){
    let file: File;

    file = event.target.files[0];
    console.log( file )

    this.imagenSubir = file;

    if(!file) {return;}
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUpload
          .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
          .subscribe( resp => {
            console.log(resp),
            Swal.fire('Imagen actualizada', 'Imagen actualizada', 'success')
            })
          
  }
}
