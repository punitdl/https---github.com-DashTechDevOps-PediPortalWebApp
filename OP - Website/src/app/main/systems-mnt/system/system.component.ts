import { Component, OnDestroy, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { System } from './system.model';
import { EcommerceSystemService } from './system.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchdocComponent } from '../searchdoc/searchdoc.component';
import { HttpClient } from '@angular/common/http';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TrainingsService } from 'app/main/trainings/trainings.service';
import { SystemTrainingsComponent } from './trainings/trainings.component';

@Component({
    selector: 'e-commerce-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EcommerceSystemComponent implements OnInit, OnDestroy {
    system: System;
    pageType: string;
    systemForm: FormGroup;
    dialogContent: TemplateRef<any>;
    dialogRef: any;
    SourceListItems: any;
    SourceTitleListItems: any;
    CategoryListItems: any;
    TypeListItems: any;
    AnatomyListItems: any;
    ProcedureListItems: any;
    DiseaseListItems:any;
    selectedbrand: any;
    selectedanatomy:any;
    selecteddisease:any;
    selectedprocedure:any;
    selectedtrainingmeterial: any[];
    DocumentsData:any[];
    form: FormGroup;
    displayedColumns = ['image'];
    selectedSource: any = "";
    public contactList: FormArray;
    SelectedTrainingListData:any;
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;
    AnatomyFilter: any =[-1];
    ImageURLNew : any =[];
   confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    selectedFile: File

    onFileChanged(event) {
        this.selectedFile = event.target.files[0]
        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
    
          reader.readAsDataURL(event.target.files[0]); // read file as data url
    
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.ImageURLNew = event.target.result;
            
          }
        }
    }

    onUpload() {
        // upload code goes here
        
        const uploadData = new FormData();
       
    
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('Module', 'System');
    uploadData.append('ID', this.system.SystemID);
    uploadData.append('SaveFolder', 'System');
    this._http.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
      reportProgress: true,
      observe: 'events'

    })
      .subscribe(event => {
        console.log(event); // handle event here
      });


    }
   

    AddDocuments() {

    }

    /**
     * Constructor
     *
     * @param {EcommerceSystemService} _ecommerceSystemService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _ecommerceSystemService: EcommerceSystemService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        public _matDialog: MatDialog,
        private _http: HttpClient,
        private _trainingsService: TrainingsService
    ) {
        // Set the default
        this.system = new System();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        const UserInputData=[];
    
            var myInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
            UserInputData.push(myInput);
            const Usertypeinput={
                "MethodName" : "GetResourceType",
                "InputStr" :  UserInputData
                }             
                
                this._ecommerceSystemService.getResourceType(Usertypeinput).then((data) => {
                 //   //console.log(data);
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
                      this.TypeListItems=jsonobj2.Result;
                }
                }); 

                const TrainingSourceInputData = [];
                var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
                TrainingSourceInputData.push(myInput);
                const TrainingSourceInput = {
                  "MethodName": "GetTrainingSource",
                  "InputStr": TrainingSourceInputData
                }
                
                this._trainingsService.getData(TrainingSourceInput).then((data) => {
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
                  }
                });


               const TrainingMeterialInputData = [];
                var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
                TrainingMeterialInputData.push(myInput);
                const TrainingMeterialInput = {
                  "MethodName": "GetTrainingMaterial",
                  "InputStr": TrainingMeterialInputData
                }
                
                this._trainingsService.getData(TrainingMeterialInput).then((data) => {
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
                    this.SourceTitleListItems = jsonobj2.Result;
                  }
                });

                var AnatomyInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","AnatomyID":1};
                UserInputData.push(AnatomyInput);
                const UserAnatomyinput={
                    "MethodName" : "GetAnatomy",
                    "InputStr" :  UserInputData
                    }   
                this._ecommerceSystemService.getAnatomy(UserAnatomyinput).then((data) => {
                   // //console.log(data);
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
                      this.AnatomyListItems=jsonobj2.Result;
                }
                }); 
                this.getProcedures();
                this.getDisease();
                this.getBrand();
                
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to update system on changes
        
        this._ecommerceSystemService.onSystemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(system => {

                if (system) {                 
                    //console.log(system);
                    //console.log(system[0].Result[0].SystemName);
                    //console.log(system[0].Result[0].BrandID);
                    this.setProductDetail(system);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.system = new System();
                }
                this.systemForm = this.createSystemForm();
                this.LoadDocFromDB(system[4].Result);
                this.LoadTraFromDB(system[3].Result);
                
                this.LoadProFromDB(system[5].Result);

                
                //console.log(system);

            });

        this.contactList = this.systemForm.get('documents') as FormArray;
       // this.addContact2();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // add a contact form group
    addContact() {
        this.contactList.push(this.createContact());
    }

    Training_popup(): void
    {
      
        this.dialogRef = this._matDialog.open(SystemTrainingsComponent, {
            panelClass: 'dailymessage-form-dialog',
            data      : {
                action: 'new',
                SystemID:this.system.SystemID
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response) => {
              console.log(response);
                if ( response )
                {
                  console.log(response);
                   console.log(response.data.SelectedTrainingListData);
                   this.SelectedTrainingListData=response.data.SelectedTrainingListData;
if(this.SelectedTrainingListData)
{
  this.LoadTraFromDB(this.SelectedTrainingListData);
}
                   
                }
                else{
                  return;
                }
              //  this._dailymessagesService.updateDailymessage(response.getRawValue());
            });
    }


    // addContact2() {
    //     this.contactList.push(this._formBuilder.group({
    //         default: true,
    //         documentid: "",
    //         url: "IFU/Bowed-Femur.doc",
    //         type: "2",
    //         name: "IFU (Bowed Femur)",
    //         share: false
    //     }));
    // }
    // remove contact from group
    removeContact(index) {
        this.contactList.removeAt(index);
    }

    createContact(): FormGroup {
        return this._formBuilder.group({
            ResourceTypeID: "",
            ResourceURL: "", 
            ResourceTypeName: "", 
            Sharable: false
        });
    }
  
    //     [this._formBuilder.group({default:true,documentid : "", url: "",type:"",name:"",share:""})]
    //     )
    get documents() {
        return this.systemForm.get('documents') as FormArray;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create system form
     *
     * @returns {FormGroup}
     */
    createSystemForm(): FormGroup {
        return this._formBuilder.group({
          SystemID: [this.system.SystemID],
            SystemName: [this.system.SystemName],
            BrandID: [this.system.BrandID],
            BrandName: [this.system.BrandName],
            ImageURL:[this.system.ImageURL],
          //  handle: [this.system.handle],
            SystemDescription: [this.system.SystemDescription],
            // categories: [this.system.categories],
            // tags: [this.system.tags],
            images: [this.system.images],
            // priceTaxExcl: [this.system.priceTaxExcl],
            // priceTaxIncl: [this.system.priceTaxIncl],
            // taxRate: [this.system.taxRate],
            // comparedPrice: [this.system.comparedPrice],
            // quantity: [this.system.quantity],
            // sku: [this.system.sku],
            // width: [this.system.width],
            // height: [this.system.height],
            // depth: [this.system.depth],
            // weight: [this.system.weight],
            // extraShippingFee: [this.system.extraShippingFee],
           // active: [this.system.active],
            AnatomyID: [this.system.AnatomyID],
            DiseaseID: [this.system.DiseaseID],
            ProcedureID: [this.system.ProcedureID],
            TrainingMaterialID: [this.system.TrainingMaterialID],
            //other: this._formBuilder.array([ this.addOtherSkillFormGroup()]),
            SystemResource: this._formBuilder.array([]),
            SystemTrainingMaterial: this._formBuilder.array([]),
            Product: this._formBuilder.array([]),
            //documents: this._formBuilder.array([this.createContact()]),
            // documents: this._formBuilder.array(
            //     [this._formBuilder.group(
            //         {  
            //             ResourceTypeID: "",
            //             ResourceURL: "", 
            //             ResourceTypeName: "", 
            //             Sharable: false
            //          })
            //         ]
            // ),

            // Training: this._formBuilder.array(
            //     [this._formBuilder.group(
            //         { 
            //             TrainingSourceName:"",
            //             TrainingSourceID:"",
            //             TrainingMaterialID:"",
            //             TrainingMaterialName:"",
            //             LinkURL:""
            //          })
            //         ]
            // )
            
        });
    }

    addDocumentFormGroup(): FormGroup {  
        return this._formBuilder.group({ 
          SystemID: [this.system.SystemID], 
          SystemResourceID: [''],
          ResourceTypeID: ['', Validators.required],
          ResourceTypeName: ['', Validators.required],
          ResourceURL: ['', Validators.required],
          Sharable: false,
          DocumentID:''
          // education: ['', Validators.required],  
          // age : ['', Validators.required],  
          // degree: ['Bachelor', Validators.required]  
        });  
      }  

      addTrainingFormGroup(): FormGroup {  
        return this._formBuilder.group({ 
          SystemID: [this.system.SystemID], 
          TrainingMaterialID: [''],
          TrainingSourceID: ['', Validators.required],
          TrainingMaterialName: ['', Validators.required],
          TrainingSourceName: ['', Validators.required],
          LinkURL: ['']
        });  
      }  
    
      addProductFormGroup(): FormGroup {  
        return this._formBuilder.group({ 
          SystemID: [this.system.SystemID], 
          ProductID: [''],
          ProductName: ['', Validators.required],
          ProductCode: ['', Validators.required],
          ImageURL: ['', Validators.required],
          ResourceCount: ['', Validators.required],
          TrainingMaterialCount:  ['', Validators.required]
        });  
      }  
      public removeButtonClick(i,newitem) {
        //(<FormArray>this.systemForm.get('SystemResource')).removeAt(i); 
        // alert(newitem.value.SystemResourceID);
        // console.log(newitem);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
              
                const DeleteDocumentInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'),
                 "Device":"D",
                  "SystemResourceID": newitem.value.SystemResourceID};
                
                DeleteDocumentInputData.push(myInput);
                const input={
                    "MethodName" : "DeleteSystemResource",
                    "InputStr" :  DeleteDocumentInputData
                    } 
                    console.log(JSON.stringify(input));
                this._ecommerceSystemService.DeleteSystemResource(input);
                (<FormArray>this.systemForm.get('SystemResource')).removeAt(i); 
            }
            this.confirmDialogRef = null;
        });  
      }

      public removeTrainingClick(i) {
        (<FormArray>this.systemForm.get('SystemTrainingMaterial')).removeAt(i);   
      }

      public removeProductClick(i) {
        (<FormArray>this.systemForm.get('Product')).removeAt(i);   
      }

      addDocumentClick(): void {  
        (<FormArray>this.systemForm.get('SystemResource')).push(this.addDocumentFormGroup());  
      }  

      addTrainingClick(): void {  
        (<FormArray>this.systemForm.get('SystemTrainingMaterial')).push(this.addTrainingFormGroup());  
      } 
      
      addProductClick(): void {  
        (<FormArray>this.systemForm.get('Product')).push(this.addProductFormGroup());  
      }  


      LoadDocFromDB(DocData: any): void {  
          // //console.log(DocData);
          // //console.log(DocData.length);
          for(let i=0;i<DocData.length;i++)
          {
            (<FormArray>this.systemForm.get('SystemResource')).push(
                this._formBuilder.group({  
                    SystemID: [this.system.SystemID], 
                    SystemResourceID: [DocData[i].SystemResourceID],
                    ResourceTypeID: [DocData[i].ResourceTypeID, Validators.required],
                    ResourceTypeName: [DocData[i].ResourceTypeName, Validators.required],
                    ResourceURL: [DocData[i].ResourceURL, Validators.required],
                    Sharable: [DocData[i].Sharable],
                    DocumentID:[DocData[i].DocumentID]
                  })
                );  
          }
      }  

      GetDocFromList()
      {
        //  ////console.log(this.systemForm.get('documentnew').value);
          const DocListData = {
            'UserID': sessionStorage.getItem('UserID'),
            'Device': 'D',
            'SelectedSystemDoc': this.systemForm.get('SystemResource').value
          };
        const Userinput={
            "MethodName" : "SaveSystemDocumets",
            "InputStr" :  DocListData
            }      
            ////console.log(JSON.stringify(Userinput));
            return;
            this._ecommerceSystemService.getBrand(Userinput).then((data) => {
                //console.log(data);
                var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                  var jsonStr2 ="";                 
                  for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                  }
                  var jsonobj2 = JSON.parse(jsonStr2);                 
                  this.CategoryListItems=jsonobj2.Result;
                 // //console.log(this.CategoryListItems);
            }
            });
    



      }

      

      LoadTraFromDB(TraData: any): void {  
    if(TraData)
    {
      console.log(TraData);
        for(let i=0;i<TraData.length;i++)
        {
          (<FormArray>this.systemForm.get('SystemTrainingMaterial')).push(
              this._formBuilder.group({  
                    SystemID: [this.system.SystemID], 
                    TrainingMaterialID: [TraData[i].TrainingMaterialID],
                    TrainingSourceID: [TraData[i].TrainingSourceID, Validators.required],
                    TrainingMaterialName: [TraData[i].TrainingMaterialName, Validators.required],
                    TrainingSourceName: [TraData[i].TrainingSourceName, Validators.required],
                    LinkURL: [TraData[i].LinkURL, Validators.required]
                })
              );  
        }
      }
    }

    

    LoadProFromDB(ProData: any): void {  
        for(let i=0;i<ProData.length;i++)
        {
          (<FormArray>this.systemForm.get('Product')).push(
              this._formBuilder.group({  
                    SystemID: [this.system.SystemID], 
                    ProductID: [ProData[i].ProductID],
                    ProductName: [ProData[i].ProductName, Validators.required],
                    BrandName: [ProData[i].BrandName, Validators.required],
                    ImageURL: [ProData[i].ImageURL, Validators.required],
                    TrainingMaterialCount:  [ProData[i].TrainingMaterialCount, Validators.required],
                    ResourceCount:  [ProData[i].ResourceCount, Validators.required],
                })
              );  
        }
    }
    /**
     * Save system
     * 
     */
    saveSystem(): void {
        const data = this.systemForm.getRawValue();
        //console.log(JSON.stringify(data));
       // data.handle = FuseUtils.handleize(data.name);

        this._ecommerceSystemService.UpdateSystem(data,this.selectedFile);
        this._matDialog.closeAll();
            // .then(() => {

            //     // Trigger the subscription with new data
            //     this._ecommerceSystemService.onSystemChanged.next(data);

            //     // Show the success message
            //     this._matSnackBar.open('System saved', 'OK', {
            //         verticalPosition: 'top',
            //         duration: 2000
            //     });
            // });
    }

    /**
     * Add system
     */
    addSystem(): void {
        const data = this.systemForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceSystemService.addSystem(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceSystemService.onSystemChanged.next(data);

                // Show the success message
                this._matSnackBar.open('System added', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                this._location.go('apps/e-commerce/systems/' + this.system.SystemID + '/' + this.system.handle);
            });
    }
    searchDoc_popup(docdata): void {
        this.dialogRef = this._matDialog.open(SearchdocComponent, {
            panelClass: 'system-form-dialog',
            data: {
                system: docdata,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':

                        //this._systemsService.updateSystem(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        // this.deleteSystem(system);

                        break;
                }
            });
    }

    finishHorizontalStepper(): void {
        alert('You have finished the horizontal stepper!');
    }
    onAnatomyChange(event:any)
    {      
      this.AnatomyFilter=event.value;
     this.getProcedures();
     this.getDisease();
    }
    getProcedures()
{
    const UserInputData=[];
    var myProcedureInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","AnatomyFilterIDs":this.AnatomyFilter};
    UserInputData.push(myProcedureInput);
    const UserProcedureinput={
        "MethodName" : "GetProcedure",
        "InputStr" :  UserInputData
        }   
    this._ecommerceSystemService.GetProcedure(UserProcedureinput).then((data) => {
       // //console.log(data);
        var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        var jsonobj1 = JSON.parse(myObjStr1);
        if (jsonobj1.Result[0]["ErrorID"] > 0)
        {
          var jsonStr2 ="";
         
          for (let i = 0; i < data["Table1"].length; i++) {
            jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
          }
          var jsonobj2 = JSON.parse(jsonStr2);                  
          this.ProcedureListItems=jsonobj2.Result;

          
    }
    }); 

}

getBrand()
{
       const UserInputData=[];
       var myInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
        UserInputData.push(myInput);
        const Userinput={
            "MethodName" : "GetBrand",
            "InputStr" :  UserInputData
            }             
            
            this._ecommerceSystemService.getBrand(Userinput).then((data) => {
                //console.log(data);
                var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                  var jsonStr2 ="";                 
                  for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                  }
                  var jsonobj2 = JSON.parse(jsonStr2);                 
                  this.CategoryListItems=jsonobj2.Result;
                  //console.log(this.CategoryListItems);
            }
            });
    
}
getDisease()
{
    const UserInputData=[];
    var DiseaseInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","AnatomyFilterIDs":this.AnatomyFilter};
    UserInputData.push(DiseaseInput);
    const UserDiseaseinput={
        "MethodName" : "GetDisease",
        "InputStr" :  UserInputData
        }   
    this._ecommerceSystemService.getDisease(UserDiseaseinput).then((data) => {
       // //console.log(data);
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
          this.DiseaseListItems=jsonobj2.Result;
    }
    }); 

}
setProductDetail(system)
{
  
    this.system.SystemID=system[0].Result[0].SystemID;
    this.system.SystemName=system[0].Result[0].SystemName;
    this.system.SystemDescription=system[0].Result[0].SystemDescription;
    this.system.ImageURL=system[0].Result[0].ImageURL;
    
    system.BrandID=system[0].Result[0].BrandID;
    system.AnatomyID=system[0].Result[0].AnatomyID;
    system.DiseaseID=system[0].Result[0].DiseaseID;
    system.ProcedureID=system[0].Result[0].ProcedureID;
    system.TrainingMaterialID=system[0].Result[0].TrainingMaterialID;
    
    this.selectedbrand = [];
    this.selectedanatomy = [];
    this.selecteddisease = [];
    this.selectedprocedure = [];
    this.selectedtrainingmeterial = [];
    //console.log(system.BrandID);
    if(system.BrandID != undefined)
    {
         this.selectedbrand = system.BrandID.split(',').map(function(item) {
            return parseInt(item, 10);
          });
    }
   this.system.BrandID=this.selectedbrand;
   
    if(system.AnatomyID != undefined)
    {
         this.selectedanatomy = system.AnatomyID.substring(1, system.AnatomyID.length-1).split(',').map(function(item) {
            return parseInt(item, 10);
          });
    }
   this.system.AnatomyID=this.selectedanatomy;
   if(system.DiseaseID != undefined)
    {
         this.selecteddisease = system.DiseaseID.substring(1, system.DiseaseID.length-1).split(',').map(function(item) {
            return parseInt(item, 10);
          });
    }
   this.system.DiseaseID=this.selecteddisease;
   if(system.ProcedureID != undefined)
   {
        this.selectedprocedure = system.ProcedureID.substring(1, system.ProcedureID.length-1).split(',').map(function(item) {
           return parseInt(item, 10);
         });
   }
this.system.ProcedureID=this.selectedprocedure;

if(system.TrainingMaterialID != undefined)
   {

    //yourString.substring(1, yourString.length-1)
        this.selectedtrainingmeterial = system.TrainingMaterialID.substring(1, system.TrainingMaterialID.length-1).split(',').map(function(item) {
          console.log(item);
           return parseInt(item, 10);
         });

   }

this.system.TrainingMaterialID=this.selectedtrainingmeterial;


//console.log(system[4]);
this.DocumentsData=system[4].Result;
//console.log('this.DocumentsData');
//console.log(this.DocumentsData);
//this.system.BrandID= ["2"];




//console.log(this.system);





}

OnSourceChange(SourceValue)
{
  
  const TrainingMeterialInputData = [];
  var myInput = { "UserID": sessionStorage.getItem('UserID'), 
  "Device": "D",
  "TrainingSourceID": SourceValue };
  TrainingMeterialInputData.push(myInput);
  const TrainingMeterialInput = {
    "MethodName": "GetTrainingMaterial",
    "InputStr": TrainingMeterialInputData
  }
  
  this._trainingsService.getData(TrainingMeterialInput).then((data) => {
     
    var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
    var jsonobj1 = JSON.parse(myObjStr1);
    if (jsonobj1.Result[0]["ErrorID"] > 0) {
      var jsonStr2 = "";
      for (let i = 0; i < data["Table1"].length; i++) {
        jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      }
      var jsonobj2 = JSON.parse(jsonStr2);
      //console.log(jsonobj2);
      this.SourceTitleListItems = jsonobj2.Result;
    }
    else{

      this.SourceTitleListItems = [];
    }
  });
}

}
