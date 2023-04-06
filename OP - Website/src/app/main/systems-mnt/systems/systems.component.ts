import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';


import { takeUntil } from 'rxjs/internal/operators';
import { EcommerceSystemsService } from './systems.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'e-commerce-systems',
    templateUrl: './systems.component.html',
    styleUrls: ['./systems.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EcommerceSystemsComponent implements OnInit {
    dataSource: FilesDataSource | null;
    displayedColumns = ['image', 'name', 'category', 'ResourceCount', 'TrainingMaterialCount', 'ProductCount'];
    selectedCategoriesSearch: any = [-1];
    BrandIDs: any;
    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    BrandListItems: any;
    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _ecommerceSystemsService: EcommerceSystemsService,
        public _matDialog: MatDialog,
        private _http: HttpClient
    ) {
        // Set the private defaults
        // _http.get<any[]>('api/common-brandlistfilter').subscribe(result => {
        //     this.BrandListItems = result;           
        //   }, error => console.error(error)); 

        const CategoryInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        CategoryInputData.push(myInput);
        const Categoryinput = {
            "MethodName": "GetBrand",
            "InputStr": CategoryInputData
        }

        this._ecommerceSystemsService.getData(Categoryinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";

                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);

                this.BrandListItems = jsonobj2.Result;


            }
            else {
                this.BrandListItems = [];
            }
        });
        this._unsubscribeAll = new Subject();
    }

    deletesystem(system): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._ecommerceSystemsService.deleteSystem(system);
            }
            this.confirmDialogRef = null;
        });

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._ecommerceSystemsService, this.paginator, this.sort);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }

                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }
    OnBrandChange(BrandID) {
        this.BrandIDs = BrandID;
        this._ecommerceSystemsService.onBrandFilterChanged.next(this.BrandIDs);
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {EcommerceSystemsService} _ecommerceSystemsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _ecommerceSystemsService: EcommerceSystemsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();

        this.filteredData = this._ecommerceSystemsService.systems;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this._ecommerceSystemsService.onSystemsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this._ecommerceSystemsService.systems.slice();

                    data = this.filterData(data);

                    this.filteredData = [...data];

                    data = this.sortData(data);

                    // Grab the page's slice of data.
                    const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                    return data.splice(startIndex, this._matPaginator.pageSize);
                }
                ));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }


    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[] {
        if (!this._matSort.active || this._matSort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._matSort.active) {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                case 'categories':
                    [propertyA, propertyB] = [a.categories[0], b.categories[0]];
                    break;
                case 'price':
                    [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
                    break;
                case 'quantity':
                    [propertyA, propertyB] = [a.quantity, b.quantity];
                    break;
                case 'active':
                    [propertyA, propertyB] = [a.active, b.active];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }



    /**
     * Disconnect
     */
    disconnect(): void {
    }


}
