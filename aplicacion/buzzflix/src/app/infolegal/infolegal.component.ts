import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-infolegal',
  templateUrl: './infolegal.component.html',
  styleUrls: ['./infolegal.component.scss']
})
export class InfolegalComponent implements OnInit {
  opcion: number
  titulos :Array<String> = []
  mensajes :Array<String> = []
  constructor(
    private router: ActivatedRoute
  ) { 
    this.titulos[1] = "Terminos de uso";
    this.titulos[2] = "Política de privacidad";
    this.titulos[3] = "Contacto";
    this.titulos[4] = "Redes sociales";
    this.mensajes[1] = "Lorem Ipsum";
    this.mensajes[2] = "Lorem IPSUM";
    this.mensajes[3] = "Si quieres contactar con Hasquiz, tanto como para reportar un error, como para dudas, o para comentarnos que vendría bien en la web, dispones del siguiente correo: <br><span>general@hasquiz.com</span>"
    
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.opcion = +params['opcion'];
    });
  }

}
