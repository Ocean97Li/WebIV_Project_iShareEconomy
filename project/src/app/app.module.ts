import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { UserComponent } from './user/user.component';
import { User } from './user/user.model';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LendObjectComponent } from './lend-object/lend-object.component';



@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SelectedUserPanelComponent,
    LendObjectComponent

  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot(
    {
      apiKey: 'AIzaSyB5eI2VPmS7wwP74_qbB6bujbzxD-xbLt4'
    }
    ),
    NgbModule.forRoot(),
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
