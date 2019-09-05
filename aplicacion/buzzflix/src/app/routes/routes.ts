import { RegistroComponent } from '../registro/registro.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
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
import { DashboardUsersComponent } from '../dashboard-users/dashboard-users.component';
import { ModeracionComponent } from '../moderacion/moderacion.component';
import { DashboardQuizComponent } from '../dashboard-quiz/dashboard-quiz.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { LogrosComponent } from '../profile/logros/logros.component';
import { InfolegalComponent } from '../infolegal/infolegal.component';
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
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear/quizz',
        component: CreateQuizzComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'usuario/perfil/:id',
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
        path: 'ver/quizz/:id',
        component: VerQuizzComponent
    },
    {
        path: 'infolegal/:opcion',
        component: InfolegalComponent
    },
    {
        path: 'ver/usuarios/:nombre',
        component: DashboardUsersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'ver/quizzes/:nombre',
        component: DashboardQuizComponent
    },
    {
        path: '',
        component: ExploradorComponent,
        CanActivate: [AuthGuard]
    },
    {
        path: 'ver/todos',
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

