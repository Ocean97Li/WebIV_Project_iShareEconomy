import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../user/user.model';
import { ShareType, LendObject } from '../lend-object.model';
import { FormGroup, Validators, FormBuilder } from '../../../../node_modules/@angular/forms';



@Component({
  selector: 'app-add-lend-object',
  templateUrl: './add-lend-object.component.html',
  styleUrls: ['./add-lend-object.component.css']
})
export class AddLendObjectComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddLendObjectDialogComponent, {
      width: '650px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      //
    });
  }
}

@Component({
  selector: './app-add-lend-object-dialog',
  templateUrl: './add-lend-object-dialog.html',
  styleUrls: ['./add-lend-object.component.css']
})
export class AddLendObjectDialogComponent implements OnInit {

  private _types = [ShareType.Service, ShareType.Tool, ShareType.Transport];
  private _chosenType: ShareType;
  private _desc;
  private _title;
  private _rules;
  private lendObject: FormGroup;
  @Output() public objectEmitter;

  constructor(
    public dialogRef: MatDialogRef<AddLendObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogContent,
    private fb: FormBuilder
  ) {
    this.objectEmitter = new EventEmitter<LendObject>();
  }

  ngOnInit(): void {
    this.lendObject = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      rules: [''],
      desc:  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
    });
    this._title = this.lendObject.get('title');
    this._desc = this.lendObject.get('desc');
    this._rules = this.lendObject.get('rules');
  }

  close(): void {
    this.dialogRef.close();
  }

  /**
   * Getter types
   * @return {ShareType}
   */
  public get types(): ShareType[] {
    return this._types;
  }

  /**
   * Getter chosenType
   * @return {ShareType}
   */
  public get chosenType(): ShareType {
    return this._chosenType;
  }

  /**
   * Setter chosenType
   * @param {ShareType} value
   */
  public set chosenType(value: ShareType) {
    this._chosenType = value;
  }

  public onSubmit() {
    this.close();
    const object = new LendObject(this.lendObject.value.title, this.lendObject.value.desc, this._chosenType);
    this.objectEmitter.emit(object);
  }

  public isTypeDirty() {
    return this.chosenType === undefined &&
    ((this._title.dirty)
    ||
    (this._desc.dirty)
    ||
    (this._rules.dirty));
  }

  public isDescDirty() {
   return this._desc.touched && this._desc.invalid;
  }

  public isTitleDirty() {
    return (this._rules.touched || this._desc.touched) && this._title.invalid;
  }

  public anyDirty() {
    return this._title.invalid || this._desc.invalid || this._chosenType === undefined;
  }

}
