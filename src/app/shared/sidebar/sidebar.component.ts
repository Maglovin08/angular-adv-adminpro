import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public usuario!: Usuario;

  menuItems: any[];

  constructor(private sidebarService: SidebarService,
              private router: Router,
              private usuarioService: UsuarioService) {

    this.menuItems  = sidebarService.menu;
    this.usuario = this.usuarioService.usuario;
   }

  ngOnInit(): void {
  }

}
