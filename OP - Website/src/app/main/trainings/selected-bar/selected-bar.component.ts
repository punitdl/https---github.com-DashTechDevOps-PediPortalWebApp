import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { TrainingsService } from 'app/main/trainings/trainings.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class TrainingsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedTrainings: boolean;
    isIndeterminate: boolean;
    selectedTrainings: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TrainingsService} _trainingsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _trainingsService: TrainingsService,
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
        this._trainingsService.onSelectedTrainingsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTrainings => {
                this.selectedTrainings = selectedTrainings;
                setTimeout(() => {
                    this.hasSelectedTrainings = selectedTrainings.length > 0;
                    this.isIndeterminate = (selectedTrainings.length !== this._trainingsService.trainings.length && selectedTrainings.length > 0);
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
        this._trainingsService.selectTrainings();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._trainingsService.deselectTrainings();
    }

    /**
     * Delete selected trainings
     */
    deleteSelectedTrainings(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected trainings?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._trainingsService.deleteSelectedTrainings();
                }
                this.confirmDialogRef = null;
            });
    }
}
