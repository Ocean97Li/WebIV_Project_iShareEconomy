import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../main/models/user.model';

function parseJwt(token) {
  if (token) {
  const b64DecodeUnicode = str =>
  decodeURIComponent(
    Array.prototype.map.call(atob(str), c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

  return JSON.parse(
    b64DecodeUnicode(
      token.split('.')[1].replace('-', '+').replace('_', '/')
    ));
  }
}
@Injectable()
export class AuthenticationService {
  private readonly _tokenKey = 'currentUser';
  private readonly _url = '/API/users';
  private _user$: BehaviorSubject<string> ;

  public redirectUrl: string;

  constructor(private http: HttpClient) {
    this.parseToken();
  }

  public parseToken() {
    let parsedToken = parseJwt(localStorage.getItem(this._tokenKey));
    if (parsedToken) {
      const expires =
        new Date(parseInt(parsedToken.exp, 10) * 1000) < new Date();
      if (expires) {
        localStorage.removeItem(this._tokenKey);
        parsedToken = null;
      } else {
        if (!this.user$) {
          console.log('token1');
          this._user$ = new BehaviorSubject<string>(parsedToken.user._id);
        }
        this.user$.next(parsedToken.user._id);
        console.log('token2');
      }
    }
  }

  get user$(): BehaviorSubject<string> {
    return this._user$;
  }

  get token(): string {
    const localToken = localStorage.getItem(this._tokenKey);
    return !!localToken ? localToken : '';
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${this._url}/login`, { username, password }).pipe(
      map((res: any) => {
        const token = res.token;
        if (token) {
          console.log(token);
          localStorage.setItem(this._tokenKey, token);
          this.parseToken();
          return true;
        } else {
          return false;
        }
      })
    );
  }

  logout() {
    if (this.user$.getValue()) {
      localStorage.removeItem(this._tokenKey);
      setTimeout(() => this._user$.next(null));
    }
  }

  register(user: User): Observable<boolean> {
    console.log(user.toJSON());
    return this.http.post(`${this._url}/register`, user.toJSON()).pipe(
      map((usr: any) => {
        const token = usr.token;
        if (token) {
          localStorage.setItem(this._tokenKey, token);
           this.parseToken();
          return true;
        } else {
          return false;
        }
      })
    );
  }

  checkUserNameAvailability(username: string): Observable<boolean> {
    return this.http.post(`${this._url}/checkusername`, { username }).pipe(
      map((item: any) => {
        if (item.username === 'alreadyexists') {
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
