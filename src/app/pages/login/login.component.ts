import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarUsuario = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {

    if (localStorage.getItem( 'email' ) ) {
      this.usuario.email = localStorage.getItem( 'email' );
      this.recordarUsuario = true;
    }
  }
  
  login( form: NgForm){

    if (form.invalid ) {
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      type: 'info',
    });
    Swal.showLoading();

    this.auth.login( this.usuario )
        .subscribe( resp =>{

          console.log(resp);
          Swal.close();

          //RECORDAR USUARIO////
          if ( this.recordarUsuario ) {
            localStorage.setItem( 'email', this.usuario.email );
          }
          ///////////////

          this.router.navigateByUrl('/home');
          
        }, (err) => {

          console.log(err.error.error.message);
          Swal.fire({
            title: 'Error al autenticar',
            text: err.error.error.message,
            type: 'error',
          });

        })
  }
}
