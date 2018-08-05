import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../authentication.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  FormControl
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { map, delay, distinctUntilChanged } from 'rxjs/operators';
import { User } from '../../main/models/user.model';
import { GeolocationService } from '../../main/services/geolocation.service';
import { MapSettingsService } from '../../main/services/map-settings.service';
import { Subject } from '../../../../node_modules/rxjs/Subject';
import { debounceTime } from 'rxjs/operators';

function passwordValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    return control.value.length < length
      ? {
          passwordTooShort: {
            requiredLength: length,
            actualLength: control.value.length
          }
        }
      : null;
  };
}

function comparePasswords(control: AbstractControl): { [key: string]: any } {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value
    ? null
    : { passwordsDiffer: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public static observer$ = new Subject<string>();
  private _val: string;
  public valSearching: boolean;
  public user: FormGroup;
  public errorMsg: string;
  public lat: number;
  public lng: number;
  public terms = false;

  get passwordControl(): FormControl {
    return <FormControl>this.user.get('passwordGroup').get('password');
  }

  get val() {
    return this._val;
  }

  set val(val: string) {
    this._val = val;
  }

  constructor(
    private _geoService: GeolocationService,
    private _mapSettings: MapSettingsService,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    RegisterComponent.observer$.pipe(
      distinctUntilChanged()
    ).subscribe(val => {
      this.val = val;
    });
    this.user = this._fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4)],
        this.serverSideValidateUsername()
      ],
      firstname: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      lastname: [
        '',
        [Validators.required, Validators.minLength(2)],
      ],
      passwordGroup: this._fb.group(
        {
          password: ['', [Validators.required, passwordValidator(12)]],
          confirmPassword: ['', Validators.required]
        },
        { validator: comparePasswords }
      ),
    });
  }

  public togglecheckbox() {
    this.terms = !this.terms;
  }

  serverSideValidateUsername(): ValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any }> => {
      return this._authenticationService
        .checkUserNameAvailability(control.value)
        .pipe(
          map(available => {
            if (available) {
              return null;
            }
            return { userAlreadyExists: true };
          })
        );
    };
  }

  locationSelected(loc: any) {
    this._geoService.reverseGeo(loc.coords);
    setTimeout(() => {
      this._geoService.reverseGeo(loc.coords);
    }, 400);
    this.lat = loc.coords.lat;
    this.lng = loc.coords.lng;
  }

  get validcoords(): boolean {
    return (this._val) && (this.lat <= 85 && this.lat >= -85) && (this.lng <= 180 && this.lng > -180);
  }


  onSubmit() {
    let user = new User(this.user.value.username, this.user.value.firstname,
    this.user.value.lastname, this._val, {'lat': this.lat, 'lng': this.lng});
    user.password = this.passwordControl.value;
    console.log(this.passwordControl.value);
    this._authenticationService
      .register(user)
      .subscribe(
        val => {
          console.log(val);
          if (val) {
            this._router.navigate(['/main']);
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMsg = `Error ${
            error.status
          } while trying to register user ${this.user.value.username}: ${
            error.error
          }`;
        }
      );
    user = null;
  }

   // map
   get title(): string {
    return this._mapSettings.title;
  }

  get zoom(): number {
    return this._mapSettings.zoom;
  }

  get label(): string {
    return this._mapSettings.label;
  }

  get streetViewControl(): boolean {
    return this._mapSettings.streetViewControl;
  }

  get zoomControl(): boolean {
    return this._mapSettings.zoomControl;
  }

  get styles(): Object[] {
    return this._mapSettings.styles;
  }
}


