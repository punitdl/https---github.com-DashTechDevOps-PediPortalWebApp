import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Onboardtask } from 'app/main/onboardtasks/onboardtask.model';
import { OnboardingsService } from '../onboardtasks.service';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
@Component({
  selector: 'onboardtasks-dailymessage-form-dialog',
  templateUrl: './onboardtask-form.component.html',
  styleUrls: ['./onboardtask-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OnboardtasksOnboardtaskFormDialogComponent {
  action: string
  onboardtask: Onboardtask;
  dailymessageForm: FormGroup;
  dialogTitle: string;
  CategoryListItems: any;
  toppings = new FormControl();
  mymodel : Array<number>;
  roleList: any = [];
  selectedFile: File
  rolearray:[];
  selectedroles: any =[];
  OnBoardingTasks: any =[];
  tasks = [];
  OnBoardingID:string;
  // movies = [
  //   'Episode I - The Phantom Menace',
  //   'Episode II - Attack of the Clones',
  //   'Episode III - Revenge of the Sith',
  //   'Episode IV - A New Hope',
  //   'Episode V - The Empire Strikes Back'
  // ];

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  onUpload() {
    // upload code goes here
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('Module', 'Profile');
    uploadData.append('ID', 'cric');
    uploadData.append('Extension', 'png');

    //this._http.post('http://192.168.29.201/RLAPI/api/Cricket/ImageUpload', uploadData, {
    this._http.post('http://api.cricstory.in//Api/Cricket/ImageUpload', uploadData, {
      reportProgress: true,
      observe: 'events'

    })
      .subscribe(event => {
       // handle event here
      });
  }




  /**
   * Constructor
   *
   * @param {MatDialogRef<OnboardtasksOnboardtaskFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder,
   *  @param {MatDialog} _matDialog
   */
  constructor(
    public matDialogRef: MatDialogRef<OnboardtasksOnboardtaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _dailymessagesService: OnboardingsService,
    private _http: HttpClient,
    public _matDialog: MatDialog
  ) {

    //this.mymodel=[];
  
    var Emptytask= {"OnBoardingTaskID":null,"OnBoardingTask":"","TaskOrder":"","isChecked":"True"}
    this.action = _data.action;
    if (this.action === 'edit')
     {
      this.dialogTitle = 'Tasks';
      this.OnBoardingTasks= _data.dailymessage.OnBoardingTask;
      this.OnBoardingID=  _data.dailymessage.OnBoardingID;
    if(this.OnBoardingTasks===undefined)
    {
      this.tasks.push(Emptytask);
    }
    else{
      this.tasks=JSON.parse(this.OnBoardingTasks);
      this.tasks.push(Emptytask);
    }
  }
    else {     
      this.dialogTitle = 'Tasks';
      this.onboardtask = new Onboardtask({});   
      this.tasks.push(Emptytask);
    }
    this.dailymessageForm = this.createDailymessageForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create dailymessage form
   * 
   * 'followupmessage' : 'The more you know!',
          'url': 'https://animalplanet.com',
          'image'   : '',
          
   *
   * @returns {FormGroup}
   */
  createDailymessageForm(): FormGroup { 
    return this._formBuilder.group({
      // MessageID: [this.dailymessage.MessageID],
      // FromDate: [this.dailymessage.FromDate],
      // ToDate: [this.dailymessage.ToDate],
      // Message: [this.dailymessage.Message],
      // FollowupMessage: [this.dailymessage.FollowupMessage],
      // LinkURL  : [this.dailymessage.LinkURL],
      // ImageURL: [this.dailymessage.ImageURL],
      // Roles:[this.dailymessage.Roles]
    });
  }
  saveOnboardTask()
  {   
  // console.log(this.tasks);
  // console.log(JSON.stringify(this.tasks));
  this._dailymessagesService.updateOnboardingTask(this.tasks,this.OnBoardingID);
    this._matDialog.closeAll();
  }
  
  // drop(event: CdkDragDrop<string[]>) {
    
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);
  //   }
  // }

  drop(event: CdkDragDrop<string[]>) {
   
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    //alert(`After drop update: ${this.movies}`);
  }

  trackByFn(index: number, item: String) {
    return index;
  }

  editonboardingtask(id,task)
  {
    console.log(id);
    console.log(task);
  }

  deleteonboardingtask(id,task): void
  {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              const DeleteTaskInputData=[];
              var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D","OnBoardingTaskID":id};
              
              DeleteTaskInputData.push(myInput);
              const input={
                  "MethodName" : "DeleteOnBoardingTask",
                  "InputStr" :  DeleteTaskInputData
                  }                    
              this._dailymessagesService.deleteOnBoardingTask(input);
           
              for (var i = 0; i < this.tasks.length; i++)
              {
                console.log(this.tasks[i]);
              if ( this.tasks[i].OnBoardingTaskID === id) { 
                this.tasks.splice(i, 1);
                  break;
              }
            }
           // console.log(JSON.stringify( this.tasks));
          }
          
          this.confirmDialogRef = null;
      });

  }
  
}
