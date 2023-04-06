import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OnboardingsService } from './onboardtasks.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { OnboardtasksOnboardtaskFormDialogComponent } from './onboardtask-form/onboardtask.component';
import { OnboardtaskweekComponent } from './onboardtaskweek/onboardtaskweek.component';



@Component({
    selector     : 'onboardtasks',
    templateUrl  : './onboardtasks.component.html',
    styleUrls    : ['./onboardtasks.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class OnboardtasksComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedDailymessages: boolean;
    searchInput: FormControl;

    

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OnboardingsService} _dailymessagesService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _dailymessagesService: OnboardingsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,

        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        // Set the defaults
        this.searchInput = new FormControl('');

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
                this.hasSelectedDailymessages = selectedDailymessages.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._dailymessagesService.onSearchTextChanged.next(searchText);
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
     * New dailymessage
     */
    newOnboardTask(): void
    {
      
        this.dialogRef = this._matDialog.open(OnboardtaskweekComponent, {
            panelClass: 'dailymessage-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }
              //  this._dailymessagesService.updateDailymessage(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
