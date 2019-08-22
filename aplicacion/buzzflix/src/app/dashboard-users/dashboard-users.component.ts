import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.scss']
})
export class DashboardUsersComponent implements OnInit {
  usuarios
  nombre:string
  navigationSubscription;
  isLoaded:boolean=false
  constructor(
    private router2: Router,
    private router: ActivatedRoute,
    private userService:UserService,
    private notifyService:NotifyService
  ) { 
    this.isLoaded=false;
    this.navigationSubscription = this.router2.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }


  initialiseInvites() {
    this.router.params.subscribe((params) => {
      this.nombre = params['nombre'];})
    this.getUsuarios();
  }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.nombre = params['nombre'];})
      //this.getUsuarios();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  getUsuarios(){
    this.userService.getUsuarios(this.nombre)
    .subscribe(resp=>{
      this.usuarios=resp;
      if(this.usuarios!=null){
        this.notifyService.notify("Búsqueda realizada","success");
      }
      if(this.usuarios.length==0){
        this.usuarios=null;
      }
      this.isLoaded=true;
    })
  }

}
