import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { OnboardingsService } from 'app/main/onboardtasks/onboardtasks.service';
import { OnboardtasksOnboardtaskFormDialogComponent } from '../onboardtask-form/onboardtask.component';
import { OnboardtaskweekComponent } from '../onboardtaskweek/onboardtaskweek.component';


@Component({
    selector     : 'onboardtasks-onboardtask-list',
    templateUrl  : './onboardtask-list.component.html',
    styleUrls    : ['./onboardtask-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DailymessagesDailymessageListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    onboardtasks: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['OnBoardingName','OnBoardingTaskStr','buttons'];
    selectedDailymessages: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DailymessagesService} _dailymessagesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _dailymessagesService: OnboardingsService,
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
        
        this.dataSource = new FilesDataSource(this._dailymessagesService);
      // console.log(this.dataSource);
        this._dailymessagesService.onDailymessagesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(onboardtasks => {
                var UserID = sessionStorage.getItem('UserID');
                //alert(UserID);
                this.onboardtasks = onboardtasks;

                this.checkboxes = {};
                // onboardtasks.map(dailymessage => {
                //     this.checkboxes[dailymessage.MessageID] = false;
                // });
            });

        this._dailymessagesService.onSelectedDailymessagesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDailymessages => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }
                    this.checkboxes[id] = selectedDailymessages.includes(id);
                }
                this.selectedDailymessages = selectedDailymessages;
            });

        this._dailymessagesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._dailymessagesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._dailymessagesService.deselectDailymessages();
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
     * Edit dailymessage
     *
     * @param dailymessage
     */
    editDailymessage(dailymessage): void
    {
        //console.log(dailymessage);
        
        this.dialogRef = this._matDialog.open(OnboardtasksOnboardtaskFormDialogComponent, {
            panelClass: 'dailymessage-form-dialog',
            data      : {
                dailymessage: dailymessage,
                action : 'edit'
               // console.console.log(dailymessage);
                
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
                    case 'add':

                       // this._dailymessagesService.SaveDailymessage(formData.getRawValue());

                        break;
                    case 'save':

                    //    this._dailymessagesService.updateDailymessage(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteOnBoarding(dailymessage);

                        break;
                }
            });
    }

    /**
     * Delete Dailymessage
     */
    deleteOnBoarding(id): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                const DeleteMessageInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D","OnBoardingID":id};
                
                DeleteMessageInputData.push(myInput);
                const input={
                    "MethodName" : "DeleteOnBoarding",
                    "InputStr" :  DeleteMessageInputData
                    }                    
                this._dailymessagesService.deleteOnBoarding(input);

                
            }
            this.confirmDialogRef = null;
        });

    }
    EditOnBoarding(onboardtask): void
    {
console.log(onboardtask);
this.dialogRef = this._matDialog.open(OnboardtaskweekComponent, {
    panelClass: 'dailymessage-form-dialog',
    data      : {
        onboardtask: onboardtask,
        action : 'edit'
       // console.console.log(dailymessage);
        
    }
});

    }

    /**
     * On selected change
     *
     * @param dailymessageId
     */
    onSelectedChange(dailymessageId): void
    {
        this._dailymessagesService.toggleSelectedDailymessage(dailymessageId);
    }

    /**
     * Toggle star
     *
     * @param dailymessageId
     */
    toggleStar(dailymessageId): void
    {
        if ( this.user.starred.includes(dailymessageId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(dailymessageId), 1);
        }
        else
        {
            this.user.starred.push(dailymessageId);
        }

        this._dailymessagesService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {OnboardingsService} _onboardingtasksService
     */
    constructor(
        private _onboardingtasksService: OnboardingsService
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
        return this._onboardingtasksService.onDailymessagesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
