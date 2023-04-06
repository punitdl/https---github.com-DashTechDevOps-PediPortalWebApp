import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';



import { HttpClient } from '@angular/common/http';
import { AuditTrailsService } from '../audittrails.service';
import { AuditTrailsFormDialogComponent } from '../audittrails-form/audittrails.component';


@Component({
    selector     : 'audittrails-audittrails-list',
    templateUrl  : './audittrails-list.component.html',
    styleUrls    : ['./audittrails-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuditTrailsListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    casecoverages: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [ 'createdon','DiseaseName','Hospital', 'createdby','PreviousValue','ModifiedValue','ModifiedOn','ModifiedBy'];
    selectedDisease: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    CategoryListItems: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DiseasesService} _casecoveragesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _casecoveragesService: AuditTrailsService,
        public _matDialog: MatDialog,
        private _http: HttpClient
    )
    {
      
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
        this.dataSource = new FilesDataSource(this._casecoveragesService);
   
        this._casecoveragesService.onCasecoveragesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(casecoverages => {
                this.casecoverages = casecoverages;
//console.log( this.casecoverages);
                this.checkboxes = {};
                // casecoverages.map(casecoverage => {
                //     this.checkboxes[casecoverage.id] = false;
                // });
            });

        this._casecoveragesService.onSelectedDiseasesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDiseases => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedDiseases.includes(id);
                }
                this.selectedDisease = selectedDiseases;
            });

        this._casecoveragesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        // this._casecoveragesService.onFilterChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         this._casecoveragesService.deselectDiseases();
        //     });
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
     * Edit system
     *
     * @param casecoverage
     */
    editcasecoverage(casecoverage): void
    {
      
        this.dialogRef = this._matDialog.open(AuditTrailsFormDialogComponent, {
            panelClass: 'casecoverage-form-dialog',
            data      : {
                casecoverage: casecoverage,
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
                    // case 'save':

                    //     this._casecoveragesService.updateDisease(formData.getRawValue());

                    //     break;
                    // /**
                    //  * Delete
                    //  */
                    // case 'delete':

                    //     this.deleteDisease(casecoverage);

                    //     break;
                }
            });
    }

    /**
     * Delete System
     */
    // deleteDisease(casecoverage): void
    // {
    //     this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    //         disableClose: false
    //     });

    //     this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    //     // this.confirmDialogRef.afterClosed().subscribe(result => {
    //     //     if ( result )
    //     //     {
    //     //         this._casecoveragesService.deleteDisease(casecoverage);
    //     //     }
    //     //     this.confirmDialogRef = null;
    //     // });

    // }

    /**
     * On selected change
     *
     * @param systemId
     */
    onSelectedChange(systemId): void
    {
        this._casecoveragesService.toggleSelectedSystem(systemId);
    }

    /**
     * Toggle star
     *
     * @param systemId
     */
    toggleStar(systemId): void
    {
        if ( this.user.starred.includes(systemId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(systemId), 1);
        }
        else
        {
            this.user.starred.push(systemId);
        }

     //   this._casecoveragesService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {SystemsService} _systemsService
     */
    constructor(
        private _systemsService: AuditTrailsService
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
        return this._systemsService.onCasecoveragesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
    
}
