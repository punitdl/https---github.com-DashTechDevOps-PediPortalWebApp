import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Onboardtask } from 'app/main/onboardtasks/onboardtask.model';
import { OnboardingsService } from '../onboardtasks.service';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-onboardtaskweek',
  templateUrl: './onboardtaskweek.component.html',
  styleUrls: ['./onboardtaskweek.component.scss']
})
export class OnboardtaskweekComponent  {
  action: string;
  onboardtaskweerForm:FormGroup;
  dialogTitle: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  Onboardtask:Onboardtask;
  

  /**
   * Constructor
   *
   * @param {MatDialogRef<OnboardtaskweekComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder,
   *  @param {MatDialog} _matDialog
   */
  constructor(
    public matDialogRef: MatDialogRef<OnboardtaskweekComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _OnboardingsService: OnboardingsService,
    private _http: HttpClient,
    public _matDialog: MatDialog
  ){ 
    this.action = _data.action;

    if ( this.action === 'edit' )
    {    
        this.dialogTitle = 'Edit OnboardTask';
        this.Onboardtask=_data.onboardtask;
    }
    else
    {
        this.dialogTitle = 'New OnboardTask';
        this.Onboardtask = new Onboardtask({});
        this.Onboardtask.OnBoardingID=null;
    }

   
    this.onboardtaskweerForm = this.createOnboardtaskForm();
  }
   /***
  * @returns {FormGroup}
  */
 createOnboardtaskForm(): FormGroup { 
   return this._formBuilder.group({
    OnBoardingID: [this.Onboardtask.OnBoardingID],
      OnBoardingName: [this.Onboardtask.OnBoardingName],
      OnBoardingDescription:[this.Onboardtask.OnBoardingDescription]
      // OnBoardingTask: [this.Onboardtask.OnBoardingName]
   });
 }

  ngOnInit(): void {

  }
  saveOnboardTask()
  {   
  // console.log(this.onboardtaskweerForm.value);
  // console.log(JSON.stringify(this.tasks));
    this._OnboardingsService.SaveOnboarding(this.onboardtaskweerForm.value);
    this._matDialog.closeAll();
  }

}
