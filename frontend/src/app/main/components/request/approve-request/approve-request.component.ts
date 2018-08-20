import { Component, OnInit } from '@angular/core';
import { ObjectRequest } from '../../../models/object-request.model';
import { LoggedInUserService } from '../../../services/logged-in-user.service';
import { MatDialog, MatDialogRef } from '../../../../../../node_modules/@angular/material';
import { SelectedUserService } from '../../../services/selected-user.service';
@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ApproveRequestDialogComponent, {
      width: '420px',
    });
  }
}
@Component({
  selector: 'app-approve-request-dialog',
  templateUrl: './approve-request-dialog.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestDialogComponent implements OnInit {
 private _inRequest: ObjectRequest[];
 private _selected: ObjectRequest;
  constructor(
    public dialogRef: MatDialogRef<ApproveRequestDialogComponent>,
    private _selectedUserService: SelectedUserService,
    private _loggedInUserService: LoggedInUserService,
  ) {
    _loggedInUserService.loggedInUser
    .pipe()
    .subscribe(val => {
      if (val) {
      this._inRequest = val.inRequest
        .filter( req => req.approved === undefined)
        .sort(function(a, b): number {
        return a.dates.fromdate.valueOf() - b.dates.fromdate.valueOf() !== 0 ?
        a.dates.fromdate.valueOf() - b.dates.fromdate.valueOf() :
        a.dates.todate.valueOf() - b.dates.todate.valueOf();
      });
    }
    });
  }

  public get selected() {
    return this._selected;
  }

  public newSelected(selected: ObjectRequest) {
    this._selected = selected;
  }

  public hasconflict(request: ObjectRequest): boolean {
    if (!this._selected) {return; }
    if (request.id === this.selected.id) {
      return;
    }
    if (request.object.id === this.selected.object.id) {
      return !((request.dates.fromdate < this._selected.dates.fromdate
        && request.dates.todate < this._selected.dates.fromdate) ||
        request.dates.fromdate > this.selected.dates.todate);
    }
   return;
  }

  public get inRequests() {
    return this._inRequest;
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSubmitApprove() {
    this._loggedInUserService.approveRequest(this._selected);
    this.close();
  }

  public onSubmitDeny() {
    this._loggedInUserService.denyRequest(this._selected);
    this.close();
  }

  ngOnInit(): void {
  }

}


