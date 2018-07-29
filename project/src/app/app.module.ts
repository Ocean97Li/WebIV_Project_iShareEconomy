import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { UserComponent } from './user/user.component';
import { SelectedUserPanelComponent } from './selected-user-panel/selected-user-panel.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LendObjectComponent } from './lend-object/lend-object.component';
import { AppRoutingModule } from './/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDialog
} from '@angular/material';
import { UserService } from './services/user.service';
import { MapSettingsService } from './services/map-settings.service';
import { GeolocationService } from './services/geolocation.service';
import { LoggedInUserComponent } from './logged-in-user/logged-in-user.component';
import { LoggedInUserService } from './services/logged-in-user.service';
import { RequestComponent } from './request/request.component';
import { UserFilterPipe } from './user/user-filter.pipe';
import { AddRequestComponent } from './request/add-request/add-request.component';
import { AddLendObjectComponent, AddLendObjectDialogComponent } from './lend-object/add-lend-object/add-lend-object.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { FormsModule } from '@angular/forms';
import { DeleteLendObjectComponent, DeleteLendObjectDialogComponent } from './lend-object/delete-lend-object/delete-lend-object.component';
import { InfoLendObjectComponent } from './lend-object/info-lend-object/info-lend-object.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SelectedUserPanelComponent,
    LendObjectComponent,
    LoggedInUserComponent,
    RequestComponent,
    UserFilterPipe,
    AddRequestComponent,
    AddLendObjectComponent,
    AddLendObjectDialogComponent,
    SearchbarComponent,
    DeleteLendObjectComponent,
    DeleteLendObjectDialogComponent,
    InfoLendObjectComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot(
    {
      apiKey: 'AIzaSyB5eI2VPmS7wwP74_qbB6bujbzxD-xbLt4'
    }
    ),
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [UserService, MapSettingsService, GeolocationService, LoggedInUserService, MatDialog],
  bootstrap: [AppComponent],
  entryComponents: [AddLendObjectDialogComponent, DeleteLendObjectDialogComponent, InfoLendObjectComponent]
})
export class AppModule { }
