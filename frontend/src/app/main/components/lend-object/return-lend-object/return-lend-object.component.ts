import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogContent } from '@angular/material';
import { LendObject } from '../../../models/lend-object.model';
import { LoggedInUserService } from '../../../services/logged-in-user.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-return-lend-object',
  templateUrl: './return-lend-object.component.html',
  styleUrls: ['./return-lend-object.component.css']
})
export class ReturnLendObjectComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ReturnLendObjectDialogComponent, {
      width: '430px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      //
    });
  }
}

@Component({
  selector: 'app-return-lend-object-dialog',
  templateUrl: './return-lend-object-dialog.html',
  styleUrls: ['./return-lend-object.component.css']
})
export class ReturnLendObjectDialogComponent implements OnInit {
  private _selected: LendObject;
  public showWarning: boolean;
  private _using: LendObject[];
  constructor(
    public dialogRef: MatDialogRef<ReturnLendObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogContent,
    private loggedInUserService: LoggedInUserService
  ) {
    loggedInUserService.loggedInUser
      .pipe(distinctUntilChanged())
      .subscribe(val => (this._using = val.using));
  }

  ngOnInit(): void {}

  public get lending() {
    return this._using;
  }

  public newSelected(object: LendObject) {
    this._selected = object;
    this.showWarning = !this.selected.isAvailable();
  }

  public get selected() {
    return this._selected;
  }

  public removeObject() {}

  public close(): void {
    this.dialogRef.close();
  }

  public onSubmit() {
    console.log(this.selected);
    this.loggedInUserService.returnLendoBject(this._selected);
    this.close();
  }
}

