import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Servicios
import { FileService } from './services/file.service';
import { AuthService as AuthWeb } from './services/auth.service';
import { NotifyService } from './services/notify.service';
import { RestService } from './services/rest.service';
import { UserService } from './services/user.service'
import { FollowService } from './services/follow.service';
import { QuizService } from './services/quiz.service';

//Componentes de la aplicación
import { AppComponent } from './app.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { NotifyComponent } from './notify/notify.component';
import { ProfileComponent } from './profile/profile.component';
import { WallComponent } from './profile/wall/wall.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FollowComponent } from './profile/follow/follow.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { QuizComponent } from './quiz/quiz.component';
import { VerQuizComponent } from './ver-quiz/ver-quiz.component';
import { ExploradorComponent } from './explorador/explorador.component';
import { MatPaginatorIntlCro } from './explorador/explorador.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { VotarComponent } from './ver-quiz/votar/votar.component';
import { DialogboxComponent } from './dialogbox/dialogbox.component';
import { ModeracionComponent } from './moderacion/moderacion.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogrosComponent } from './profile/logros/logros.component';
import { InfolegalComponent } from './infolegal/infolegal.component';
import { ForgetComponent } from './forget/forget.component';
import { BuscadorComponent } from './buscador/buscador.component';

//Guards
import { AuthGuard } from './guards/auth.guard';
import { AuthedGuard } from './guards/authed.guard';

//Material
import { AppMaterialModule } from './app-material/app-material.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireStorage } from 'angularfire2/storage';

//Pipes
import { PrettyDatePipe } from './pipes/pretty-date.pipe';

//Utilidades
import { ClipboardModule } from 'ngx-clipboard';
import { NgProgressModule } from 'ngx-progressbar';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { CookieLawModule } from 'angular2-cookie-law';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
//Redes sociales
import { GoogleLoginProvider, FacebookLoginProvider, AuthService, AuthServiceConfig } from 'angular-6-social-login';

//Necesarios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';

//Enrutamiento
import { AppRoutingModule } from './app-routing.module';
import { ROUTES } from './routes/routes';

//Fecha Española
import { registerLocaleData } from '@angular/common';
import localePy from '@angular/common/locales/es-PY';
import { BarraNavegacionComponent } from './barra-navegacion/barra-navegacion.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import {TransferHttpCacheModule} from '@nguniversal/common';

import { StateTransferInitializerModule } from './dom-content-loaded.module';

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
    CreateQuizComponent,
    QuizComponent,
    VerQuizComponent,
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
    BarraNavegacionComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ng-universal-demystified'
    }),
    TransferHttpCacheModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' }),
    ScrollToModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgProgressModule,
    BrowserAnimationsModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserTransferStateModule,
    CookieLawModule,
    ImageCropperModule,
    RoundProgressModule,
    AppMaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    StateTransferInitializerModule
  ],
  exports: [RouterModule],
  providers: [
    AuthWeb, AuthService, AuthGuard, AuthedGuard, QuizService, NotifyService, UserService, FollowService,
    RestService, FileService, AngularFireStorage,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    { provide: AuthServiceConfig, useFactory: socialConfigs }, NgxImageCompressService],
  bootstrap: [AppComponent],
  entryComponents: [DialogboxComponent]
})
export class AppBrowserModule { }
