import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './registro/registro.component';
import { ROUTES } from './routes/routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent, MyErrorStateMatcher } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthedGuard } from './guards/authed.guard';
import { NotifyComponent } from './notify/notify.component';
import { NotifyService } from './services/notify.service';
import { RestService } from './services/rest.service';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from './services/user.service'
import { PrettyDatePipe } from './pipes/pretty-date.pipe';
import { NgProgressModule } from 'ngx-progressbar';
import { WallComponent } from './profile/wall/wall.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FollowComponent } from './profile/follow/follow.component';
import { FollowService } from './services/follow.service';
import { CreateQuizzComponent } from './create-quizz/create-quizz.component';
import { QuizzService } from './services/quizz.service';
import { QuizzComponent } from './quizz/quizz.component';
import { VerQuizzComponent } from './ver-quizz/ver-quizz.component';
import { ExploradorComponent } from './explorador/explorador.component';
import { MatPaginatorIntlCro } from './explorador/explorador.component';

import { UsuarioComponent } from './usuario/usuario.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';
import { VotarComponent } from './ver-quizz/votar/votar.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFireStorage } from 'angularfire2/storage';
import { DialogboxComponent } from './dialogbox/dialogbox.component';
import { ModeracionComponent } from './moderacion/moderacion.component';
import { DashboardQuizComponent } from './dashboard-quiz/dashboard-quiz.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogrosComponent } from './profile/logros/logros.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    DashboardComponent,
    LoginComponent,
    MyErrorStateMatcher,
    NotifyComponent,
    ProfileComponent,
    PrettyDatePipe,
    WallComponent,
    EditProfileComponent,
    FollowComponent,
    CreateQuizzComponent,
    QuizzComponent,
    VerQuizzComponent,
    ExploradorComponent,
    UsuarioComponent,
    DashboardUsersComponent,
    VotarComponent,
    DialogboxComponent,
    ModeracionComponent,
    DashboardQuizComponent,
    NotFoundComponent,
    LogrosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    NgProgressModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatGridListModule,
    MatListModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard, AuthedGuard, QuizzService, NotifyService, UserService, FollowService, RestService, AngularFirestore, AngularFireStorage, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }],
  bootstrap: [AppComponent],
  entryComponents: [DialogboxComponent]
})
export class AppModule { }
