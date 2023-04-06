import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


import { CasecoveragesService } from '../casecoverages.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class CasecoveragesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedSystems: boolean;
    isIndeterminate: boolean;
    selectedSystems: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DiseasesService} _diseasesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _diseasesService: CasecoveragesService,
        public _matDialog: MatDialog
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
        this._diseasesService.onSelectedDiseasesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSystems => {
                this.selectedSystems = selectedSystems;
                setTimeout(() => {
                    this.hasSelectedSystems = selectedSystems.length > 0;
                    this.isIndeterminate = (selectedSystems.length !== this._diseasesService.casecoverages.length && selectedSystems.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
       // this._diseasesService.selectDiseses();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
     //   this._diseasesService.deselectDiseases();
    }

    /**
     * Delete selected systems
     */
    deleteSelectedSystems(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected systems?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                  //  this._diseasesService.deleteSelectedDiseases();
                }
                this.confirmDialogRef = null;
            });
    }
}
