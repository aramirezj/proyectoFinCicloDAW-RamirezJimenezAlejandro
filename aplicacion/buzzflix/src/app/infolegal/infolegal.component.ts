import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-infolegal',
  templateUrl: './infolegal.component.html',
  styleUrls: ['./infolegal.component.scss']
})
export class InfolegalComponent implements OnInit {
  opcion: string;
  titulos :Array<string> = [];
  mensajes :Array<string> = [];
  subsRouter: Subscription;
  constructor(
    private router: ActivatedRoute
  ) { 
    this.titulos["terminos"] = "Terminos de uso";
    this.titulos["privacidad"] = "Política de privacidad";
    this.titulos["contacto"] = "Contacto";
    this.titulos["redes"] = "Redes sociales";
    this.mensajes["terminos"] = "Lorem Ipsum";
    this.mensajes["privacidad"] = "Lorem IPSUM";
    this.mensajes["contacto"] = "Si quieres contactar con Hasquiz, tanto como para reportar un error, como para dudas, o para comentarnos que vendría bien en la web, dispones del siguiente correo: <br><span>general@hasquiz.com</span>"
    
  }

  ngOnInit() {
    this.subsRouter = this.router.params.subscribe((params) => {
      this.opcion = params['opcion'];
    });
  }
  ngOnDestroy(){
    this.subsRouter.unsubscribe();
  }

}
