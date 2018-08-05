import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { MapSettingsService } from './main/services/map-settings.service';
import { GeolocationService } from './main/services/geolocation.service';
import { AuthenticationService } from './user/authentication.service';
import { AuthGuardService } from './user/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  exports: [],
  bootstrap: [AppComponent],
  providers: [
    MapSettingsService,
    GeolocationService,
    AuthenticationService,
    AuthGuardService
  ]
})
export class AppModule {
}

