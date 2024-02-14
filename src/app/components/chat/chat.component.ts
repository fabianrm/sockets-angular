import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {

  texto = '';
  mensajesSubscription?: Subscription;
  elemento?: HTMLElement;

  mensajes: any[] = [];


  constructor(public chatService: ChatService) { }

  ngOnInit() {

    this.elemento = document.getElementById('chat-mensajes')!;

    this.mensajesSubscription = this.chatService.getMessages().subscribe(msg => {
      // console.log(msg);
      this.mensajes.push(msg);
      setTimeout(() => {
        this.elemento!.scrollTop = this.elemento!.scrollHeight;

      }, 50);


    });
  }

  ngOnDestroy(): void {
    this.mensajesSubscription?.unsubscribe;
  }

  enviar() {
    //console.log(this.texto);

    if (this.texto.trim().length === 0) return;
    this.chatService.sendMessage(this.texto);
    this.texto = '';
  }

}
