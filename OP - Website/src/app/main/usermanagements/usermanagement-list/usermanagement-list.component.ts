import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsermanagementsService } from 'app/main/usermanagements/usermanagements.service';
import { UsermanagementsUsermanagementFormDialogComponent } from 'app/main/usermanagements/usermanagement-form/usermanagement-form.component';

@Component({
    selector: 'usermanagements-usermanagement-list',
    templateUrl: './usermanagement-list.component.html',
    styleUrls: ['./usermanagement-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UsermanagementsUsermanagementListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    usermanagements: any;
    user: any;
    dataSource: FilesDataSource | null;
    //'region','state','doj',
    displayedColumns = ['name', 'lastname', 'role', 'email', 'buttons'];
    selectedUsermanagements: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._usermanagementsService);

        this._usermanagementsService.onUsermanagementsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(usermanagements => {
                this.usermanagements = usermanagements;

                this.checkboxes = {};
                usermanagements.map(usermanagement => {
                    this.checkboxes[usermanagement.UserID] = false;
                });
            });

        this._usermanagementsService.onSelectedUsermanagementsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsermanagements => {
                for (const UserID in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(UserID)) {
                        continue;
                    }

                    this.checkboxes[UserID] = selectedUsermanagements.includes(UserID);
                }
                this.selectedUsermanagements = selectedUsermanagements;
            });

        this._usermanagementsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._usermanagementsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._usermanagementsService.deselectUsermanagements();
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
     * Edit usermanagement
     *
     * @param usermanagement
     */
    editUsermanagement(usermanagement): void {
        this.dialogRef = this._matDialog.open(UsermanagementsUsermanagementFormDialogComponent, {
            panelClass: 'usermanagement-form-dialog',
            data: {
                usermanagement: usermanagement,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':

                        ///  this._usermanagementsService.updateUsermanagement(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteUsermanagement(usermanagement);

                        break;
                }
            });
    }

    /**
     * Delete Usermanagement
     */
    deleteUsermanagement(usermanagement): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const DeleteUserInputData = [];
                var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "EditUserID": usermanagement.UserID };

                DeleteUserInputData.push(myInput);
                const input = {
                    "MethodName": "DeleteUser",
                    "InputStr": DeleteUserInputData
                }
                this._usermanagementsService.deleteUsermanagement(input);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param usermanagementId
     */
    onSelectedChange(usermanagementId): void {
        this._usermanagementsService.toggleSelectedUsermanagement(usermanagementId);
    }

    /**
     * Toggle star
     *
     * @param usermanagementId
     */
    toggleStar(usermanagementId): void {
        if (this.user.starred.includes(usermanagementId)) {
            this.user.starred.splice(this.user.starred.indexOf(usermanagementId), 1);
        }
        else {
            this.user.starred.push(usermanagementId);
        }

        this._usermanagementsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {UsermanagementsService} _usermanagementsService
     */
    constructor(
        private _usermanagementsService: UsermanagementsService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._usermanagementsService.onUsermanagementsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
