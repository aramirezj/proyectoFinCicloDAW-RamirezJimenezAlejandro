import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from '../modelo/Usuario';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  id:number
  cantidad:number
  
  @Input() usuario:Usuario
  constructor(
  ) { }

  ngOnInit() {
  }



}
