import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FormBuilder } from '@angular/forms';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AuditTrailsService } from './audittrails.service';
import { AuditTrailsFormDialogComponent } from './audittrails-form/audittrails.component';



@Component({
  selector: 'app-audittrails',
  templateUrl: './audittrails.component.html',
  styleUrls: ['./audittrails.component.scss']
})


export class AudittrailsComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedDisease: boolean;
    searchInput: FormControl;
    RepresentativeListItems: any;
    SurgeonListItems:any;
    HospitalListItems:any;
    casecoverageFilterForm: FormGroup;

    RepresentativeFilter: string = "-1";
    HospitalFilter: string = "-1";
    SurgeonFilter: string = "-1";
    representative: any =[-1];
    surgeon: any=[-1];
    StartDate:any;
    Start:Date;
    End:Date;
    NewStart:any;
    NewEnd:any;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CasecoverageService} _casecoverageService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _casecoverageService: AuditTrailsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _http: HttpClient
    )
    {
        const SurgeonInputData=[];
        var myInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
        SurgeonInputData.push(myInput);
        const Surgeoninput={
            "MethodName" : "GetSurgeon",
            "InputStr" :  SurgeonInputData
            }             
            
            this._casecoverageService.getData(Surgeoninput).then((data) => {
                var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                  var jsonStr2 ="";                 
                  for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                  }
                  var jsonobj2 = JSON.parse(jsonStr2);              
                  this.SurgeonListItems=jsonobj2.Result;
                
            }
           
            else{
                this.SurgeonListItems=[];
            }
            }); 


            const RepInputData=[];
        var RepInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
        RepInputData.push(RepInput);
        const Representativeinput={
            "MethodName" : "GetRepresentative",
            "InputStr" :  RepInputData
            }             
            
            this._casecoverageService.getData(Representativeinput).then((data) => {              
                var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                  var jsonStr2 ="";                 
                  for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                  }
                  var jsonobj2 = JSON.parse(jsonStr2);                 
                  this.RepresentativeListItems=jsonobj2.Result;
            }
            else{
                this.RepresentativeListItems=[];
            }
            }); 

       
          _http.get<any[]>('api/casecoverage-hospitallist').subscribe(result => {
            this.HospitalListItems = result;           
          }, error => console.error(error)); 


        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this._casecoverageService.onSelectedDiseasesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDiseases => {
                this.hasSelectedDisease = selectedDiseases.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._casecoverageService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New system
     */
    newSystem(): void
    {
        this.dialogRef = this._matDialog.open(AuditTrailsFormDialogComponent, {
            panelClass: 'casecoverage-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }

               // this._casecoverageService.updateCasecoverage(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onRepresentativeChange(event:any)
    {      
   
        this._casecoverageService.onRepresentativeFilterChanged.next(event.value);   
    }

    onSurgeonChange(event:any)
    { 
        this._casecoverageService.onSurgeonFilterChanged.next(event.value);  
    }

 loadStartDate(event)
 {
this.Start=event;
}
 loadEndDate(event)
 {
    this.End=event; 
 }

 loadCaseCoverageData()
 {
     if(this.Start !== undefined && this.End !== undefined)
     {
        this.NewStart=this.Start;
        this.NewEnd=this.End;
        const datefilters=[];
        datefilters.push(this.NewStart);
        datefilters.push(this.NewEnd)
        this._casecoverageService.onDateChangedLoad.next(datefilters);  
     }
 }
}
