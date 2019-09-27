import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from '@angular/material';

import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistroComponent } from './registro/registro.component';
import { ROUTES } from './routes/routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ImageService } from './services/image.service';
import { FileService } from './services/file.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
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
import { VotarComponent } from './ver-quizz/votar/votar.component';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

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
import { NotFoundComponent } from './not-found/not-found.component';
import { LogrosComponent } from './profile/logros/logros.component';
import { InfolegalComponent } from './infolegal/infolegal.component';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es-PY';
import { ForgetComponent } from './forget/forget.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";



let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("AIzaSyD0doNEJDBrNeQHFsgMvjnIFl8TKDIAtZ4")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("Facebook-App-Id")
  }
]);

export function provideConfig() {
  return config;
}



registerLocaleData(localePy, 'es');
@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    LoginComponent,
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
    VotarComponent,
    DialogboxComponent,
    ModeracionComponent,
    NotFoundComponent,
    LogrosComponent,
    InfolegalComponent,
    ForgetComponent,
    BuscadorComponent,
  ],
  imports: [
    SocialLoginModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload', useHash: true }),
    ScrollToModule.forRoot(),
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
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard, AuthedGuard, QuizzService, NotifyService, UserService, FollowService, RestService, ImageService,
    , FileService, AngularFirestore, AngularFireStorage, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: LocationStrategy, useClass: HashLocationStrategy }, { provide: LOCALE_ID, useValue: 'es-Ar' },
    { provide: AuthServiceConfig, useFactory: provideConfig }, NgxImageCompressService],
  bootstrap: [AppComponent],
  entryComponents: [DialogboxComponent]
})
export class AppModule { }
