import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
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
import { AuthService as AuthWeb } from './services/auth.service';
import { ImageService } from './services/image.service';
import { FileService } from './services/file.service';
import { HttpModule } from '@angular/http';
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
import { registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es-PY';
import { ForgetComponent } from './forget/forget.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { HttpClientModule } from '@angular/common/http';
import { WINDOW } from '@ng-toolkit/universal';
import { NgxImageCompressService } from 'ngx-image-compress';


import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angular-6-social-login';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';

import { CookieLawModule } from 'angular2-cookie-law';


export function socialConfigs() {
  const config = new AuthServiceConfig(
    [
      /*{  
        id: FacebookLoginProvider.PROVIDER_ID,  
        provider: new FacebookLoginProvider('app -id')  
      },  */
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('801500894032-trdaca331u29nbru10kt0jo57ng56695.apps.googleusercontent.com')
      }
    ]
  );
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
    BrowserModule.withServerTransition({
      appId: 'ng-universal-demystified'
    }),
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' }),
    ScrollToModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgProgressModule,
    BrowserAnimationsModule,
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
    AngularFireDatabaseModule,
    BrowserTransferStateModule,
    CookieLawModule
  ],
  exports: [RouterModule],
  providers: [
    AuthWeb,AuthService, AuthGuard, AuthedGuard, QuizzService, NotifyService, UserService, FollowService,
    RestService, ImageService, FileService, AngularFirestore, AngularFireStorage,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    , { provide: WINDOW, useValue: {} }, { provide: AuthServiceConfig, useFactory: socialConfigs }, NgxImageCompressService],
  bootstrap: [AppComponent],
  entryComponents: [DialogboxComponent]
})
export class AppBrowserModule { }