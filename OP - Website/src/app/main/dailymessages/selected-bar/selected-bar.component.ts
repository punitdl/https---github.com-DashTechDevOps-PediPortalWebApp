import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DailymessagesService } from 'app/main/dailymessages/dailymessages.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class DailymessagesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedDailymessages: boolean;
    isIndeterminate: boolean;
    selectedDailymessages: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DailymessagesService} _dailymessagesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _dailymessagesService: DailymessagesService,
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
        this._dailymessagesService.onSelectedDailymessagesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDailymessages => {
                this.selectedDailymessages = selectedDailymessages;
                setTimeout(() => {
                    this.hasSelectedDailymessages = selectedDailymessages.length > 0;
                    this.isIndeterminate = (selectedDailymessages.length !== this._dailymessagesService.dailymessages.length && selectedDailymessages.length > 0);
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
        this._dailymessagesService.selectDailymessages();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._dailymessagesService.deselectDailymessages();
    }

    /**
     * Delete selected dailymessages
     */
    deleteSelectedDailymessages(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected dailymessages?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._dailymessagesService.deleteSelectedDailymessages();
                }
                this.confirmDialogRef = null;
            });
    }
}
