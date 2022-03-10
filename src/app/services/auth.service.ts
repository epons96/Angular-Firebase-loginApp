import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";

import { UsuarioModel } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyAmzilexzCloUOUaE4ZQEQRXY4UwIL1jKE';

  userToken: string;

  constructor( private http: HttpClient) { 
    this.leerToken();
  }
  
  //create new user
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  login( usuario: UsuarioModel){

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http.post(
      `${ this.url }signInWithPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp =>{
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
    
  }

  logout(){
    localStorage.removeItem( 'token' );
  }

  nuevoUsuario( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http.post(
      `${ this.url }signUp?key=${ this.apikey }`,
      authData
    ).pipe(
      map( resp =>{
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }

  guardarToken( idToken: string ){

    this.userToken = idToken;
    localStorage.setItem( 'token', idToken );

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem( 'expira', hoy.getTime().toString() )
  }

  leerToken( ){

    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token'); 
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean{
  
    if (this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem( 'expira' ));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }

}
