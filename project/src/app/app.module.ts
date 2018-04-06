import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { UserComponent } from './user/user.component';
import { User } from './user/user.model';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent

  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot(
    {
      apiKey: 'AIzaSyB5eI2VPmS7wwP74_qbB6bujbzxD-xbLt4'
    }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
