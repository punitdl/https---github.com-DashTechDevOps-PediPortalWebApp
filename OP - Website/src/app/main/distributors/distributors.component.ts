import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { DistributorsService } from 'app/main/distributors/distributors.service';
import { DistributorsDistributorFormDialogComponent } from 'app/main/distributors/distributor-form/distributor-form.component';

@Component({
    selector: 'distributors',
    templateUrl: './distributors.component.html',
    styleUrls: ['./distributors.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DistributorsComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedDistributors: boolean;
    searchInput: FormControl;
    region: any = [-1];
    //  region: String ="-1";
    RegionListItems: any;
    RegionFilter = [];
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DistributorsService} _distributorsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _distributorsService: DistributorsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    ) {
        // this.filteredData = this._ecommerceProductsService.products;
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        const RegionInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        RegionInputData.push(myInput);
        const Userinput = {
            "MethodName": "GetRegion",
            "InputStr": RegionInputData
        }

        this._distributorsService.getData(Userinput).then((data) => {
            // //console.log(data);
            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";
                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);
                this.RegionListItems = jsonobj2.Result;
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._distributorsService.onSelectedDistributorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDistributors => {
                this.hasSelectedDistributors = selectedDistributors.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._distributorsService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New distributor
     */
    newDistributor(): void {
        this.dialogRef = this._matDialog.open(DistributorsDistributorFormDialogComponent, {
            panelClass: 'distributor-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this._distributorsService.updateDistributor(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    onRegionChange(event: any) {
        //console.log(event.value);
        //console.log(this.region);
        this._distributorsService.onRegionFilterChanged.next(this.region);

    }


}
