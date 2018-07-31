import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user.model';
import { LendObject } from '../../../models/lend-object.model';
import { UserService } from '../../../services/user.service';
import { LoggedInUserService } from '../../../services/logged-in-user.service';



@Component({
  selector: 'app-delete-lend-object',
  templateUrl: './delete-lend-object.component.html',
  styleUrls: ['./delete-lend-object.component.css']
})
export class DeleteLendObjectComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteLendObjectDialogComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      //
    });
  }
}

@Component({
  selector: 'app-delete-lend-object-dialog',
  templateUrl: './delete-lend-object-dialog.html',
  styleUrls: ['./delete-lend-object.component.css']
})
export class DeleteLendObjectDialogComponent implements OnInit {
  private _selected: LendObject;
  public showWarning: boolean;


  constructor(
    public dialogRef: MatDialogRef<DeleteLendObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogContent,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  ngOnInit(): void {
  }

  public get lending() {
    return this.loggedInUserService.loggedInUser.lending;
  }

  public newSelected(object: LendObject) {
    this._selected = object;
    this.showWarning = !(this.selected.isAvailable());
  }

  public get selected() {
    return this._selected;
  }

  public removeObject() {
    return this.loggedInUserService.removeObject(this._selected);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    this.close();
    //
  }
}
