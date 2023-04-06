import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DistributorsService } from 'app/main/distributors/distributors.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class DistributorsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedDistributors: boolean;
    isIndeterminate: boolean;
    selectedDistributors: string[];

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

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._distributorsService.onSelectedDistributorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDistributors => {
                this.selectedDistributors = selectedDistributors;
                setTimeout(() => {
                    this.hasSelectedDistributors = selectedDistributors.length > 0;
                    this.isIndeterminate = (selectedDistributors.length !== this._distributorsService.distributors.length && selectedDistributors.length > 0);
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
        this._distributorsService.selectDistributors();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._distributorsService.deselectDistributors();
    }

    /**
     * Delete selected distributors
     */
    deleteSelectedDistributors(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected distributors?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._distributorsService.deleteSelectedDistributors();
                }
                this.confirmDialogRef = null;
            });
    }
}
