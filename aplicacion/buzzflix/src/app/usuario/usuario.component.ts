import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from '../modelo/Usuario';
import { UserService } from '../services/user.service';
import { QuizzService } from '../services/quizz.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  id:number
  cantidad:number
  
  @Input() usuario
  constructor(
    private quizzService:QuizzService,
    
  ) { }

  ngOnInit() {
    this.getCantidad();
   
  }

  getCantidad(){
    this.quizzService.getCantidad(this.usuario.id)
    .subscribe(resp =>{
      this.cantidad=resp;
    })
  }

}
