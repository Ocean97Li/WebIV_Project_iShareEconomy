import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class RealTimeService {
  private socket = io('http://localhost:3000');
  constructor() {
  }

  // initiate conversation
  public startCommunication(id: string) {
    this.socket.emit('joinmyself', id);
  }

  public startListeningTo(id: string) {
    this.socket.emit('join', id);
  }

  // lsiten for new conversations
  public listenForCommunication(): Observable<string> {
    const observable = new Observable<string>(
      observer => {
        this.socket.on('starting conversation', (id) => {
          observer.next(id);
        });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  public signalInRequestSentToUser(id: string) {
    this.socket.emit('sent', id);
  }

  public listenForInRequest(): Observable<string> {
    const observable = new Observable<string>(
      observer => {
        this.socket.on('sent', (id) => {
          observer.next(id);
        });
        return () => {
        };
    });
    return observable;
  }

  public signalApproveDenyRequestToUser(id: string) {
    this.socket.emit('approveddenied', id);
  }

  public listenForApproveDenyRequest(): Observable<string> {
    const observable = new Observable<string>(
      observer => {
        this.socket.on('approveddenied', (id) => {
          observer.next(id);
        });
        return () => {
        };
    });
    return observable;
  }

  public signalAddRemoveObject(id: string) {
    this.socket.emit('addobject', id);
  }

  public listenForAddRemoveObject(): Observable<string> {
    const observable = new Observable<string>(
      observer => {
        this.socket.on('addobject', (id) => {
          observer.next(id);
        });
        return () => {
        };
    });
    return observable;
  }

  public signalReturnObject(id: string) {
    this.socket.emit('return', id);
  }

  public listenForReturnObject(): Observable<string> {
    const observable = new Observable<string>(
      observer => {
        this.socket.on('return', (id) => {
          observer.next(id);
        });
        return () => {
        };
    });
    return observable;
  }

}
