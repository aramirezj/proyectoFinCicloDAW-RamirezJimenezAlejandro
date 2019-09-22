import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { Usuario } from '../modelo/Usuario';
import { Quizz } from '../modelo/Quizz';
import { QuizzService } from '../services/quizz.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit {
  busquedaForm:FormGroup;
  aBuscar: String;
  usuarios: Array<Usuario> = [];
  quizzes: Array<Quizz> = [];
  navigationSubscription;
  isLoaded: boolean = false
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
    this.router.params.subscribe((params) => {
      this.aBuscar = params['nombre'];
      if (this.aBuscar != null) {
        this.getQuizzes();
        this.getUsuarios();
      }else{
        this.createForm();
      }

    })
  }

  initialiseInvites() {
    this.router.params.subscribe((params) => {
      this.aBuscar = params['nombre'];
    })
  }

  createForm(){
    this.busquedaForm = new FormGroup({
      busqueda: new FormControl(null, [Validators.required,Validators.minLength(1)])
    });
  }
  onSubmit(){
    this.router2.navigate(['buscador/' + this.busquedaForm.get('busqueda').value]);
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
