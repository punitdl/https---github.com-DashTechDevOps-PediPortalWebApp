import { Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DistributorsService } from 'app/main/distributors/distributors.service';
import { DistributorsDistributorFormDialogComponent } from 'app/main/distributors/distributor-form/distributor-form.component';

@Component({
    selector     : 'distributors-distributor-list',
    templateUrl  : './distributor-list.component.html',
    styleUrls    : ['./distributor-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DistributorsDistributorListComponent implements OnInit, OnDestroy, OnChanges
{
    @ViewChild('dialogContent')
  //  @Input() RegionFilter: any;
    dialogContent: TemplateRef<any>;

    distributors: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['PhotoURL','CompanyName', 'MobileNo'];
    selectedDistributors: any[];
    checkboxes: {};
    dialogRef: any;
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DistributorsService} _distributorsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _distributorsService: DistributorsService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnChanges()
    {
//console.log(this.RegionFilter);
    }
    /**
     * On init
     * 
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._distributorsService);
       // console.log(this.dataSource);
        this._distributorsService.onDistributorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(distributors => {
                this.distributors = distributors;
                this.checkboxes = {};
                distributors.map(distributor => {
                    this.checkboxes[distributor.DistributorID] = false;
                });
            });

        this._distributorsService.onSelectedDistributorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDistributors => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedDistributors.includes(id);
                }
                this.selectedDistributors = selectedDistributors;
            });

        this._distributorsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._distributorsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._distributorsService.deselectDistributors();
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
     * Edit distributor
     *
     * @param distributor
     */
    editDistributor(distributor): void
    {
        this.dialogRef = this._matDialog.open(DistributorsDistributorFormDialogComponent, {
            panelClass: 'distributor-form-dialog',
            data      : {
                distributor: distributor,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._distributorsService.updateDistributor(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteDistributor(distributor);

                        break;
                }
            });
    }

    /**
     * Delete Distributor
     */
    deleteDistributor(distributor): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                const DeleteDistributorInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "DistributorID":distributor.DistributorID};
                
                DeleteDistributorInputData.push(myInput);
                const input={
                    "MethodName" : "DeleteDistributor",
                    "InputStr" :  DeleteDistributorInputData
                    } 
                this._distributorsService.deleteDistributor(input);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param distributorId
     */
    onSelectedChange(distributorId): void
    {
        this._distributorsService.toggleSelectedDistributor(distributorId);
    }

    /**
     * Toggle star
     *
     * @param distributorId
     */
    toggleStar(distributorId): void
    {
        if ( this.user.starred.includes(distributorId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(distributorId), 1);
        }
        else
        {
            this.user.starred.push(distributorId);
        }

        this._distributorsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {DistributorsService} _distributorsService
     */
    constructor(
        private _distributorsService: DistributorsService
        //private _matPaginator: MatPaginator
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._distributorsService.onDistributorsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
