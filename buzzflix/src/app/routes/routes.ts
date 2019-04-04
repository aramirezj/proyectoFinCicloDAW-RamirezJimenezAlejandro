import { RegistroComponent } from '../registro/registro.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthedGuard } from '../guards/authed.guard';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ProfileComponent } from '../profile/profile.component';
import { WallComponent } from './../profile/wall/wall.component';
import { EditProfileComponent } from './../profile/edit-profile/edit-profile.component';
import { Component } from '@angular/core';
import { CreateQuizzComponent } from '../create-quizz/create-quizz.component';
import { VerQuizzComponent } from '../ver-quizz/ver-quizz.component';
import { ExploradorComponent } from '../explorador/explorador.component';
import { DashboardUsersComponent } from '../dashboard-users/dashboard-users.component';
export const ROUTES = [
    {
        path:'auth/register',
        component: RegistroComponent,
        canActivate: [AuthedGuard]
    },
    {
        path:'auth/login',
        component: LoginComponent,
        canActivate: [AuthedGuard]
    },
    {
        path:'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'crear/quizz',
        component: CreateQuizzComponent
    },
    {
        path:'usuario/perfil/:id',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        children:[{
            path:'',
            component:WallComponent
        },{
            path:'edit',
            component:EditProfileComponent
        }]
    },
    {
        path:'ver/quizz/:id',
        component: VerQuizzComponent,
        canActivate:[AuthGuard]
    },
    {
        path:'ver/usuarios/:nombre',
        component: DashboardUsersComponent,
        canActivate:[AuthGuard],
        //runGuardsAndResolvers: `paramsChange`
    },
    {
        path:'ver/todos',
        component:ExploradorComponent,
        CanActivate:[AuthGuard]
    }
    
]

