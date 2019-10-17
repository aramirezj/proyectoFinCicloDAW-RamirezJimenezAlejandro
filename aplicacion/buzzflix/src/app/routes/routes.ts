import { RegistroComponent } from '../registro/registro.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthedGuard } from '../guards/authed.guard';
import { CanActivate } from '@angular/router/';
import { ProfileComponent } from '../profile/profile.component';
import { WallComponent } from './../profile/wall/wall.component';
import { EditProfileComponent } from './../profile/edit-profile/edit-profile.component';
import { CreateQuizzComponent } from '../create-quizz/create-quizz.component';
import { VerQuizzComponent } from '../ver-quizz/ver-quizz.component';
import { ExploradorComponent } from '../explorador/explorador.component';
import { ModeracionComponent } from '../moderacion/moderacion.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ForgetComponent } from '../forget/forget.component';
import { LogrosComponent } from '../profile/logros/logros.component';
import { InfolegalComponent } from '../infolegal/infolegal.component';
import { BuscadorComponent } from '../buscador/buscador.component';
export const ROUTES = [
    {
        path: 'auth/register',
        component: RegistroComponent,
        canActivate: [AuthedGuard]
    },
    {
        path: 'auth/login',
        component: LoginComponent,
        canActivate: [AuthedGuard]
    },
    {
        path: 'auth/login/:confirmacion',
        component: LoginComponent,
        canActivate: [AuthedGuard]
    },
    {
        path: 'auth/forget/:confirmacion',
        component: ForgetComponent,
        canActivate: [AuthedGuard]
    },
    {
        path: 'auth/forget',
        component: ForgetComponent,
        canActivate: [AuthedGuard]
    },
    {
        path: 'crear/quiz',
        component: CreateQuizzComponent,
        canActivate: []
    },
    {
        path: 'perfil/:nickname',
        component: ProfileComponent,
        children: [{
            path: '',
            component: WallComponent
        }, {
            path: 'wall',
            component: WallComponent
        }, {
            path: 'edit',
            component: EditProfileComponent
        }, {
            path: 'logros',
            component: LogrosComponent
        }]
    },
    {
        path: 'quiz/:id',
        component: VerQuizzComponent
    },
    {
        path: 'info/:opcion',
        component: InfolegalComponent
    },
    {
        path: 'buscador',
        component: BuscadorComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'buscador/:nombre',
        component: BuscadorComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: ExploradorComponent,
        CanActivate: [AuthGuard]
    },
    {
        path: 'ver/:opcion',
        component: ExploradorComponent,
        CanActivate: [AuthGuard]
    },
    {
        path: 'moderacion',
        component: ModeracionComponent,
        CanActivate: [AuthGuard]
    },
    {
        path: '**',
        component: NotFoundComponent
    }

]

