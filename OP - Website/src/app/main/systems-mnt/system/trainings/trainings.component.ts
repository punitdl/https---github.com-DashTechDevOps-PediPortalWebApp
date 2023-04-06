import { Component,OnDestroy,Inject, OnInit,TemplateRef,ViewChild,ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FilesDataSource } from 'app/main/productgrid/productgrid.component';
import { EcommerceSystemService } from '../system.service';
import { FuseUtils } from '@fuse/utils';
import { EcommerceSystemComponent } from '../system.component';
@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SystemTrainingsComponent implements OnInit,OnDestroy {

  
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;
  checkboxes: {};
  TrainingMaterialID:any[];
  action: string;
  SystemID:any;
  trainings: any;
  dataSource: FilesDataSource | null;
  list: any[];
  SelectedTrainingList= [];
  SelectedTrainingListData= [];
  private _unsubscribeAll: Subject<any>;
  selectedFilter = "";
  SourceListItems: any="-1";
  SelectedTraining:any;
  SearchText:string;
  /**
   * Constructor
   *
   * @param {MatDialogRef<SystemTrainingsComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder,
   *  @param {MatDialog} _matDialog,
   *@param {EcommerceSystemService} _ecommerceSystemService,
   @param {TrainingsService} _trainingsService  */
  constructor(
    private _ecommerceSystemService: EcommerceSystemService,
    public matDialogRef: MatDialogRef<SystemTrainingsComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
 
    private _http: HttpClient,
    public _matDialog: MatDialog
  ) {
    this.SystemID = _data.SystemID;
    

                   const TrainingSourceInputData = [];
                   var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
                   TrainingSourceInputData.push(myInput);
                   const TrainingSourceInput = {
                     "MethodName": "GetTrainingSource",
                     "InputStr": TrainingSourceInputData
                   }
                   
                   this._ecommerceSystemService.getData(TrainingSourceInput).then((data) => {
                      console.log(data);
                     var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                     var jsonobj1 = JSON.parse(myObjStr1);
                     if (jsonobj1.Result[0]["ErrorID"] > 0) {
                       var jsonStr2 = "";
                       for (let i = 0; i < data["Table1"].length; i++) {
                         jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                       }
                       var jsonobj2 = JSON.parse(jsonStr2);
                       //console.log(jsonobj2);
                       this.SourceListItems = jsonobj2.Result;

                       console.log(this.SourceListItems);
                     }
                   });
                  

   }

  ngOnInit(): void {
   
   
  }
  /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
      //  this._unsubscribeAll.next();
      //  this._unsubscribeAll.complete();
    }


    get result() {
      return this.trainings.filter(item => item.checked);
      console.log(this.list);
    }
 /**
     * On selected change
     *
     * @param trainingRow
     */
    onSelectedChange(trainingRow): void
     {
       console.log(trainingRow);
      this.SelectedTrainingList.push(trainingRow.TrainingMaterialID);
      this.SelectedTrainingListData.push(trainingRow);
      console.log(this.SelectedTrainingList);
    }
    

    loadTrainingData(SystemID,TrainingSourceID,SearchText)
 {
 
  const UserInputData=[];
  var UserInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","SystemID":SystemID,"TrainingSourceID":TrainingSourceID,"SearchText":SearchText};
                 UserInputData.push(UserInput);
                 const Traininginput={
                     "MethodName" : "GetTrainingMaterial",
                     "InputStr" :  UserInputData
                     }   
                 this._ecommerceSystemService.GetTraining(Traininginput).then((data) => {
                    console.log(data);
                     var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                     var jsonobj1 = JSON.parse(myObjStr1);
                     if (jsonobj1.Result[0]["ErrorID"] > 0)
                     {
                       var jsonStr2 ="";
                      
                       for (let i = 0; i < data["Table1"].length; i++) {
                         jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                       }
                       var jsonobj2 = JSON.parse(jsonStr2);
                   //    //console.log(jsonobj2);
                       this.trainings=jsonobj2.Result;
                       console.log( this.trainings);
                 }
                 else{
                  this.trainings=[];
                 }
                 }); 
 }

 SelectedFilter(event)
 {
if(event)
{  
 this.SelectedTraining=event;
 }
}
 FilterTextChange(event)
 {
   console.log(event);
   this.SearchText=event;
 }
 loadTrainingDataGrid()
 {
if(this.SelectedTraining || this.SearchText)
{
  this.loadTrainingData(this.SystemID,this.SelectedTraining,this.SearchText);
}
 }
 pushTrainingDataGrid()
 {
   
   if(this.SelectedTrainingList)   {
   console.log(this.SelectedTrainingList);
   console.log(this.SystemID)
   const UserInputData=[];
   
   var UserInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","SystemID":this.SystemID,"TrainingMaterialID":this.SelectedTrainingList};
                  UserInputData.push(UserInput);
                  const Traininginput={
                      "MethodName" : "SaveSystemTrainingMaterial",
                      "InputStr" :  UserInputData
                      }   
                      console.log(JSON.stringify(Traininginput));
                      this._ecommerceSystemService.getData(Traininginput).then((data) => {
                        console.log(data);
                         var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                         var jsonobj1 = JSON.parse(myObjStr1);
                         if (jsonobj1.Result[0]["ErrorID"] > 0)
                         {
                           var jsonStr2 ="";
                          
                           for (let i = 0; i < data["Table1"].length; i++) {
                             jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                           }
                           var jsonobj2 = JSON.parse(jsonStr2);
                       //    //console.log(jsonobj2);
                  //     window.location.reload();

//this.matDialogRef.close({ event: 'close', data: this.SelectedTrainingList });

// const editCouponRef = this.matDialogRef.close(EcommerceSystemComponent,{data:this.SelectedTrainingList });
//     editCouponRef.componentInstance.promotionId = id;
                           
                     }
                     else{
                    //  this.trainings=[];
                     }
                     });
                     this.matDialogRef.close({    
                      data      : {        
                        SelectedTrainingListData:this.SelectedTrainingListData
                      }
                    }); 
 }

 }
}
