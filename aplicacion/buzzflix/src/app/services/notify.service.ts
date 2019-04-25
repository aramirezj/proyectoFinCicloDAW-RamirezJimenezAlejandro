import { Injectable,EventEmitter } from '@angular/core';
import { Message } from '../modelo/Message';

@Injectable()
export class NotifyService{
    public newMessageReceived:EventEmitter<Message>
    constructor(){
        this.newMessageReceived = new EventEmitter()
    }    
    notify(message:string,type:string){
        let newMessage = new Message(message,type);
        this.newMessageReceived.emit(newMessage);
    }
}