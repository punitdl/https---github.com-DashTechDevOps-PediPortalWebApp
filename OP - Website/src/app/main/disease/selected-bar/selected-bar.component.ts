import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DiseasesService } from '../diseases.service';



@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class DiseasesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedDiseases: boolean;
    isIndeterminate: boolean;
    selectedDiseases: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DiseasesService} _diseasesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _diseasesService: DiseasesService,
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
            .subscribe(selectedDiseases => {
                this.selectedDiseases = selectedDiseases;
                setTimeout(() => {
                    this.hasSelectedDiseases = selectedDiseases.length > 0;
                    this.isIndeterminate = (selectedDiseases.length !== this._diseasesService.diseases.length && selectedDiseases.length > 0);
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
        this._diseasesService.selectDiseases();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._diseasesService.deselectDiseases();
    }

    /**
     * Delete selected trainings
     */
    deleteSelectedDiseases(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected diseases?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._diseasesService.deleteSelectedTrainings();
                }
                this.confirmDialogRef = null;
            });
    }
}
