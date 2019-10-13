import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Logro } from 'src/app/modelo/Logro';
import * as $ from 'jquery';
@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss']
})
export class LogrosComponent implements OnInit {
  public listaLogros: Array<Logro>;
  public id: number;
  constructor(
    private userService: UserService
  ) { }
  ngOnInit() {
    this.userService.currentMessage.subscribe(message => this.id = message)
    this.userService.getLogros(this.id)
      .subscribe((logros) => {
        this.listaLogros = logros;
        for (let logro of this.listaLogros) {
          if (logro.fecha == null) {
            logro.fecha = "Aun no conseguido";
          }
        }
      });
  }
  isPendiente(logro: Logro) {
    return logro.fecha == "Aun no conseguido" ?
      "card-img-top pendiente" :
      "card-img-top";
  }
  setGif(idLogro) {
    $("#img"+idLogro)[0].setAttribute("src", "assets/logros/logro"+idLogro+".gif");
  }
  deleteGif(idLogro) {
    $("#img"+idLogro)[0].setAttribute("src", "assets/logros/logro"+idLogro+".png");
  }
}


