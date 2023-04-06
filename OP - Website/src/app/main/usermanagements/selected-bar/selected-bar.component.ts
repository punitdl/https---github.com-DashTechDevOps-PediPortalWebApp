import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsermanagementsService } from 'app/main/usermanagements/usermanagements.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class UsermanagementsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedUsermanagements: boolean;
    isIndeterminate: boolean;
    selectedUsermanagements: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsermanagementsService} _usermanagementsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _usermanagementsService: UsermanagementsService,
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
        this._usermanagementsService.onSelectedUsermanagementsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsermanagements => {
                this.selectedUsermanagements = selectedUsermanagements;
                setTimeout(() => {
                    this.hasSelectedUsermanagements = selectedUsermanagements.length > 0;
                    this.isIndeterminate = (selectedUsermanagements.length !== this._usermanagementsService.usermanagements.length && selectedUsermanagements.length > 0);
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
        this._usermanagementsService.selectUsermanagements();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._usermanagementsService.deselectUsermanagements();
    }

    /**
     * Delete selected usermanagements
     */
    deleteSelectedUsermanagements(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected usermanagements?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._usermanagementsService.deleteSelectedUsermanagements();
                }
                this.confirmDialogRef = null;
            });
    }
}
