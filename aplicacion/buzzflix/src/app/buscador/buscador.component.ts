import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Usuario } from '../modelo/Usuario';
import { Quizz } from '../modelo/Quizz';
import { QuizzService } from '../services/quizz.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {
  busquedaForm: FormGroup;
  aBuscar: string;
  usuarios: Array<Usuario> = [];
  quizzes: Array<Quizz> = [];
  navigationSubscription;
  isLoaded: boolean = false;
  subsRouter: Subscription;
  constructor(
    private router2: Router,
    private router: ActivatedRoute,
    private quizzService: QuizzService,
    private userService: UserService
  ) {
    this.isLoaded = false;
    this.navigationSubscription = this.router2.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  ngOnInit() {
    this.subsRouter = this.router.params.subscribe((params) => {
      this.aBuscar = params['nombre'];
      this.createForm();
      this.getQuizzes();
      this.getUsuarios();

    })
  }

  ngOnDestroy() {
    this.subsRouter.unsubscribe();
  }

  initialiseInvites() { //Para en la misma ruta ir actualizando la busqueda
    this.subsRouter = this.router.params.subscribe((params) => {
      this.aBuscar = params['nombre'];
    })
  }

  createForm() {
    this.busquedaForm = new FormGroup({
      busqueda: new FormControl(this.aBuscar, [])
    });
  }
  onSubmit() {
    if (this.busquedaForm.get('busqueda').value.length > 0) {
      this.router2.navigate(['buscador/' + this.busquedaForm.get('busqueda').value]);
    }

  }

  getQuizzes() {
    this.quizzService.getQuizzes(this.aBuscar)
      .subscribe(resp => {
        this.quizzes = resp;
        this.isLoaded = true;
      })
  }

  getUsuarios() {
    this.userService.getUsuarios(this.aBuscar)
      .subscribe(resp => {
        this.usuarios = resp;
        this.isLoaded = true;
      })
  }

}
