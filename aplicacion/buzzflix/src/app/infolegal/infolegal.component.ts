import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-infolegal',
  templateUrl: './infolegal.component.html',
  styleUrls: ['./infolegal.component.scss']
})
export class InfolegalComponent implements OnInit {
  opcion: string;
  titulos :Array<String> = []
  mensajes :Array<String> = []
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
    this.router.params.subscribe((params) => {
      this.opcion = params['opcion'];
    });
  }

}
