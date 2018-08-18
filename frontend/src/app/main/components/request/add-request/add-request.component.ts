import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {
  MatDialog,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
  DateAdapter,
} from '@angular/material';
import { User } from '../../../models/user.model';
import { LendObject } from '../../../models/lend-object.model';
import { LoggedInUserService } from '../../../services/logged-in-user.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { SelectedUserService } from '../../../services/selected-user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObjectRequest } from '../../../models/object-request.model';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddRequestDialogComponent, {
      width: '400px',
      data: {}
    });
  }
}

@Component({
  selector: 'app-add-dialog-request',
  templateUrl: './add-request-dialog.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestDialogComponent implements OnInit {
  private _selected: LendObject;
  private _lending: LendObject[];
  private request: FormGroup;
  private _user: {id: string, name: string};
  private _fromdate: any;
  private _todate: any;
  private _message: any;
  constructor(
    public dialogRef: MatDialogRef<AddRequestDialogComponent>,
    private _selectedUserService: SelectedUserService,
    private _loggedInUserService: LoggedInUserService,
    private adapter: DateAdapter<any>,
    private fb: FormBuilder
  ) {
    _selectedUserService.selectedUser
      .pipe(distinctUntilChanged())
      .subscribe(val => {if (val) {
        this._lending = val.lending;
      }});
    _loggedInUserService.loggedInUser
    .pipe()
    .subscribe(val => { if (val) {
      this._user = {id: val.id, name: val.name};
    }
    });
  }

  public get validDateCombo(): boolean {
    return (this.fromdate <= this._todate)
    && (this.fromdate.setHours(0, 0, 0, 0)).valueOf() >= (new Date().setHours(0, 0, 0, 0)).valueOf();
  }

  public get fromdate(): Date {
    return this._fromdate;
  }

  public get todate(): Date {
    return this._todate;
  }

  public set fromdate(date: Date) {
     this._fromdate = date;
  }

  public set todate(date: Date) {
     this._todate = date;
  }

  public get name() {
    return this._user.name;
  }

  ngOnInit(): void {
  this.adapter.setLocale(getLanguage());
  this.request = this.fb.group({
    fromdate: ['', [Validators.required]],
    todate:  ['', [Validators.required]]
  });
  this._fromdate = this.request.get('fromdate');
  this._todate = this.request.get('todate');
  }

  public get lending() {
    return this._lending;
  }

  public newSelected(object: LendObject) {
    this._selected = object;
  }

  public get selected() {
    return this._selected;
  }

  public removeObject() {}

  public close(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    console.log(this.fromdate);
    const request = new ObjectRequest(this._user, this._selected, this._fromdate, this.todate);
    this._loggedInUserService.addNewRequest(request).pipe(distinctUntilChanged()).subscribe(
      val => {
        if (val) {
          this.close();
        }
      }
    );
  }

}

function getLanguage() {
 if (navigator.languages !== undefined) {
   return navigator.languages[0];
  } else  {
   return navigator.language;
  }
}

function isOutdatedRequest(fromdate) {
  // request that is for a date already passed
  return fromdate <= new Date().setHours(0, 0, 0, 0);
}
function isDeformedRequest(fromdate, todate) {
  // request that is for a date already passed
  return !(fromdate <= todate);
}
function isConflictingRequest(request, checkwith) {
  // checks for overlaps
  return (request.fromdate  <= checkwith.todate )  &&  (request.todate  >= checkwith.fromdate);
}

