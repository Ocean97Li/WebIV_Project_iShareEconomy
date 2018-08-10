import { AuthGuardService } from './auth-guard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { GOOGLE_MAPS_API_KEY } from '../../environments/api-keys';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { basehttpInterceptorProviders } from '../http-interceptors';
const api = GOOGLE_MAPS_API_KEY;
const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: api
    }),
    RouterModule.forChild(routes),
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent
  ],
  providers: [
    // basehttpInterceptorProviders,
  ],
  exports: []
})
export class UserModule {}
