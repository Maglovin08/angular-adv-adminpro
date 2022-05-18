import { Component, OnInit } from '@angular/core';

import { MedicoService } from 'src/app/services/medico.service';
import { Medicos } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';




@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  public medicos: Medicos[] = [];
  public hospital!: Hospital[];
  public cargando: boolean = true;

  constructor( private medicoService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService) { }

  ngOnInit(): void {

    this.cargarMedicos();
  }
  buscar( termino: string) {

    if ( termino.length === 0 ) {
      return  this.cargarMedicos();

    }

    this.busquedasService.buscar('medicos', termino)
              .subscribe( resp => {
                this.medicos = resp
              });
  }
  cargarMedicos(){
    
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
         this.cargando = false;
         this.medicos = medicos;
        })
  }

  guardarCambio( medico: Medicos ){

    this.medicoService.actualizarMedicos( medico )
        .subscribe( resp => {
          Swal.fire('Actualizado', medico.nombre, 'success');
        })

  }

  borrarMedico( medico:Medicos ){

        Swal.fire({
          title: '¿Borrar usuario?',
          text: `Esta a punto de borrar a ${ medico.nombre }`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, borrarlo!'
        }).then((result) => {
          if (result.value) {
            this.medicoService.borrarMedicos( medico._id! )
              .subscribe( resp =>
               {
                this.cargarMedicos();
                Swal.fire(
                'Médico borrado',
                `${ medico.nombre } ha sido eliminado`,
                'success'
              )
            })
          }
        })

  }


  abrirModal(medico:Medicos){
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);

  }
}
