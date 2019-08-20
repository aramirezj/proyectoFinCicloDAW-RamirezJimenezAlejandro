import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Logro } from 'src/app/modelo/Logro';
import { PrettyDatePipe } from '../../pipes/pretty-date.pipe';
@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss']
})
export class LogrosComponent implements OnInit {
  public listaLogros: Array<Logro>;
  public id: number;
  constructor(
    private userService: UserService,
  ) { }
  ngOnInit() {
    this.userService.currentMessage.subscribe(message => this.id = message)
    this.userService.getLogros(this.id)
      .then((logros) => {
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


}


