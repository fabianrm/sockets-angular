import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from './../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario?: Usuario;

  constructor(private socket: Socket, private router: Router) {
    this.cargarStorage();
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    });


    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });

  }

  //emitir eventos
  emit(evento: string, payload?: any, callback?: Function) {
    console.log('Emitiendo', evento);

    //emit('EVENTO', payload, callback?)
    this.socket.emit(evento, payload, callback);

  }

  //escuchar eventos
  listen(evento: string) {
    return this.socket.fromEvent(evento);
  }

  loginWS(nombre: string) {

    return new Promise((resolve: any, reject) => {
      console.log('Configurando', nombre);

      this.emit('configurar-usuario', { nombre: nombre }, (resp: any) => {
        console.log(resp);
        this.usuario = new Usuario(nombre);
        this.guardarStorage();
        resolve();
      });

    });

  }

  getUsuario() {
    return this.usuario;
  }


  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }


  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario')!);
      this.loginWS(this.usuario!.nombre);
    }
  }

  logutWS() {
    this.usuario = undefined;
    localStorage.removeItem('usuario');

    const payload = {
      nombre: 'sin-nombre'
    }

    this.emit('configurar-usuario', payload, () => { });
    this.router.navigateByUrl('');

  }



}
