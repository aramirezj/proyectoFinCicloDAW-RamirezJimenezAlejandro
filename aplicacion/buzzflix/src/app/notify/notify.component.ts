import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../services/notify.service';
import { Message } from '../modelo/Message';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  message: Message
  constructor(
    private notifyService: NotifyService
  ) {
    this.notifyService.newMessageReceived.subscribe((message)=>
      this.newMessageReceived(message)
    )
   }

  newMessageReceived(message:Message){
    this.message=message;
    setTimeout(()=>{
      this.message=null;
    },2000)
  }

  ngOnInit() {
  }

}
