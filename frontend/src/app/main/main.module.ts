import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { UserComponent } from './components/user/user.component';
import { SelectedUserPanelComponent } from './components/selected-user-panel/selected-user-panel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LendObjectComponent } from './components/lend-object/lend-object/lend-object.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { LoggedInUserComponent } from './components/logged-in-user/logged-in-user.component';
import { LoggedInUserService } from './services/logged-in-user.service';
import { RequestComponent } from './components/request/request/request.component';
import { UserFilterPipe } from './components/user/user-filter.pipe';
import { AddRequestComponent } from './components/request/add-request/add-request.component';
import {
  AddLendObjectComponent,
  AddLendObjectDialogComponent
} from './components/lend-object/add-lend-object/add-lend-object.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FormsModule } from '@angular/forms';
import {
  DeleteLendObjectComponent,
  DeleteLendObjectDialogComponent
} from './components/lend-object/delete-lend-object/delete-lend-object.component';
import { InfoLendObjectComponent } from './components/lend-object/info-lend-object/info-lend-object.component';
import { MainComponent } from './components/main/main.component';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../user/login/login.component';
import { RegisterComponent } from '../user/register/register.component';
import { GOOGLE_MAPS_API_KEY } from '../../environments/api-keys';
import { LogoutComponent } from '../user/logout/logout.component';

const api = GOOGLE_MAPS_API_KEY;
const appRoutes: Routes = [
  { path: 'main', component: MainComponent},
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MatSidenavModule,
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: api,
      language: 'English'
    }),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MainComponent,
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
  providers: [
    UserService,
    LoggedInUserService,
    MatDialog,
  ],
  entryComponents: [
    AddLendObjectDialogComponent,
    DeleteLendObjectDialogComponent,
    InfoLendObjectComponent
  ]
})
export class MainModule {}
