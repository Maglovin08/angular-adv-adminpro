import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Medicos } from '../../../models/medico.model';



@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado!: Hospital | undefined;
  public medicoSeleccionado!: Medicos | undefined;
  

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({ id }) => this.cargarMedico( id ) );

    this.cargarHospitales();

    this.medicoForm = this.fb.group({
      nombre: ['Hernando', Validators.required],
      hospital: ['', Validators.required],

    });

    this.medicoForm.get('hospital')?.valueChanges
        .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId);
    
    });
  }

  cargarMedico( id: string){

    if( id === 'nuevo'){
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
        .subscribe( medico => {

          if( !medico ){
            return this.router.navigateByUrl(`/dashboard/medicos`)
          }

          const{ nombre, hospital:{_id}} = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({ nombre, hospital: _id })

        })
  }

  cargarHospitales(){

    this.hospitalService.cargarHospitales()
                .subscribe( (hospitales: Hospital[]) => {
                  this.hospitales = hospitales;
                })

  }

  guardarMedico(){

    const { nombre } = this.medicoForm.value


    if ( this.medicoSeleccionado){
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedicos( data )
          .subscribe( resp => {
            Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
          })

    }else{
      //Crear
      this.medicoService.crearMedicos( this.medicoForm.value )
          .subscribe( (resp:any) =>{
            console.log(resp);
            Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
            this.router.navigateByUrl(`/dashboard/medicos/${ resp.medico._id}`)
          })
    }
    }



}
