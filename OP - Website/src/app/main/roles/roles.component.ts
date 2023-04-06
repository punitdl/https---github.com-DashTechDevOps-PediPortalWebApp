import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


import { RolesRoleFormDialogComponent } from './role-form/roleform.component';
import { RolesService } from './roles.service';


@Component({
    selector: 'roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RolesComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedRoles: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {RolesService} _rolesService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _rolesService: RolesService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,

        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
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
    ngOnInit(): void {


        this._rolesService.onSelectedRolesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTrainings => {
                this.hasSelectedRoles = selectedTrainings.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )

            .subscribe(searchText => {
                if (this.searchInput.value !== '') {
                    //alert(searchText);
                    this._rolesService.onSearchTextChanged.next(searchText);
                }

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
     * New training
     */
    newRole(): void {
        this.dialogRef = this._matDialog.open(RolesRoleFormDialogComponent, {
            panelClass: 'role-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                //     this._rolesService.updateRole(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
