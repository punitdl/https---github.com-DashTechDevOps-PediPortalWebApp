import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { UsermanagementsService } from 'app/main/usermanagements/usermanagements.service';
import { UsermanagementsUsermanagementFormDialogComponent } from 'app/main/usermanagements/usermanagement-form/usermanagement-form.component';
import { HttpClient } from '@angular/common/http';

@Component({
    selector     : 'usermanagements',
    templateUrl  : './usermanagements.component.html',
    styleUrls    : ['./usermanagements.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UsermanagementsComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedUsermanagements: boolean;
    searchInput: FormControl;
    role: any =[-1];
    distributor:  any =[-1];
    region:  any =[-1];
   
    // Private
    RoleListItems: any;
    RegionListItems: any;
    DistributorListItems: any;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsermanagementsService} _usermanagementsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _usermanagementsService: UsermanagementsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _http: HttpClient
    )
    {
        // Set the defaults
        const RoleInputData=[];
        var myInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
        RoleInputData.push(myInput);
        const Roleinput={
            "MethodName" : "GetRole",
            "InputStr" :  RoleInputData
            }             
            
            this._usermanagementsService.getData(Roleinput).then((data) => {
               // console.log(data);
                var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                  var jsonStr2 ="";                 
                  for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                  }
                  var jsonobj2 = JSON.parse(jsonStr2);
                  //console.log(jsonobj2);
                  this.RoleListItems=jsonobj2.Result;
            }
            }); 
            const RegionInputData=[];
            var myInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
            RegionInputData.push(myInput);
            const Regioninput={
                "MethodName" : "GetRegion",
                "InputStr" :  RegionInputData
                }             
                
                this._usermanagementsService.getData(Regioninput).then((data) => {
                   // console.log(data);
                    var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);
                    if (jsonobj1.Result[0]["ErrorID"] > 0)
                    {
                      var jsonStr2 ="";                 
                      for (let i = 0; i < data["Table1"].length; i++) {
                        jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                      }
                      var jsonobj2 = JSON.parse(jsonStr2);
                      //console.log(jsonobj2);
                      this.RegionListItems=jsonobj2.Result;
                }
                }); 
        // _http.get<any[]>('api/common-rolefilterlist').subscribe(result => {
        //     this.RoleListItems = result;
        //     console.log(this.RoleListItems);
        //   }, error => console.error(error)); 

        //   _http.get<any[]>('api/common-regionfilterlist').subscribe(result => {
        //     this.RegionListItems = result;
        //     console.log(this.RegionListItems);
        //   }, error => console.error(error)); 
        const DistributorInputData=[];
        var myDistInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D",  "RegionFilterIDs":[-1]};
        DistributorInputData.push(myDistInput);
        const DistributorInput={
            "MethodName" : "GetDistributor",
            "InputStr" :  DistributorInputData
            }             
            console.log(JSON.stringify(DistributorInput));
            this._usermanagementsService.getData(DistributorInput).then((data) => {
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
                  //console.log(jsonobj2);
                  this.DistributorListItems=jsonobj2.Result;
            }
            });
        //   _http.get<any[]>('api/common-distributorfilterlist').subscribe(result => {
        //     this.DistributorListItems = result;
        //     console.log(this.DistributorListItems);
        //   }, error => console.error(error));

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
        this._usermanagementsService.onSelectedUsermanagementsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsermanagements => {
                this.hasSelectedUsermanagements = selectedUsermanagements.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._usermanagementsService.onSearchTextChanged.next(searchText);
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
     * New usermanagement
     */
    newUsermanagement(): void
    {
        this.dialogRef = this._matDialog.open(UsermanagementsUsermanagementFormDialogComponent, {
            panelClass: 'usermanagement-form-dialog',
            data      : {
                action: 'new'
            }
        });

        // this.dialogRef.afterClosed()
        //     .subscribe((response: FormGroup) => {
        //         if ( !response )
        //         {
        //             return;
        //         }

        //         this._usermanagementsService.updateUsermanagement(response.getRawValue());
        //     });
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
    onRoleChange(event:any)
    {    
       this._usermanagementsService.onRoleFilterChanged.next(this.role);
    }
    onRegionChange(event:any)
    {  
        this._usermanagementsService.onRegionFilterChanged.next(this.region);
    }
    onDistributorChange(event:any)
    {
        this._usermanagementsService.onDistributorFilterChanged.next(this.distributor);
    }
}
