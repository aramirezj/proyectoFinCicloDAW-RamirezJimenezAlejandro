import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Logro } from 'src/app/modelo/Logro';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss']
})
export class LogrosComponent implements OnInit {
  listaLogros: Array<Logro>;
  id: number;
  subsRouter: Subscription;
  constructor(
    private userService: UserService,
    private router: ActivatedRoute
  ) { }
  ngOnInit() {
    this.subsRouter = this.router.parent.params.subscribe((params) => {
      this.userService.getLogros(params["nickname"])
        .subscribe((logros) => {
          this.listaLogros = logros;
          for (let logro of this.listaLogros) {
            logro.src = "assets/logros/logro" + logro.id + ".png";
            logro.fecha = logro.fecha == null ? "Aún no conseguido" : logro.fecha;
          }
        });
    })
  }
  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }
  isPendiente(logro: Logro) {
    return logro.fecha == "Aún no conseguido" ?
      "card-img-top pendiente" :
      "card-img-top";
  }
  setGif(logro) {
    let splitted = logro.src.split(".");
    logro.src = splitted[0] + ".gif";
  }
  deleteGif(logro) {
    let splitted = logro.src.split(".");
    logro.src = splitted[0] + ".png";
  }
}


