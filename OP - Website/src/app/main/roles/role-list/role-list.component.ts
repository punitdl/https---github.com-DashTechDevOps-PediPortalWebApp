import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


import { RolesRoleFormDialogComponent } from '../role-form/roleform.component';
import { RolesService } from '../roles.service';



@Component({
    selector     : 'roles-role-list',
    templateUrl  : './role-list.component.html',
    styleUrls    : ['./role-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RolesRoleListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    roles: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['RoleName','RoleDescription','ModuleStr',  'buttons'];
    selectedRoles: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {RolesService} _rolesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _rolesService: RolesService,
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
        this.dataSource = new FilesDataSource(this._rolesService);
        
        this._rolesService.onRolesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(roles => {
                this.roles = roles;

                this.checkboxes = {};
                roles.map(roles => {
                    this.checkboxes[roles.RoleID] = false;
                });
            });

        this._rolesService.onSelectedRolesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRoles => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedRoles.includes(id);
                }
                this.selectedRoles = selectedRoles;
            });

        this._rolesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._rolesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._rolesService.deselectRoles();
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
     * Edit training
     *
     * @param role
     */
    editRole(role): void
    {
        var EnableClick=role.Freeze;      
       
        this.dialogRef = this._matDialog.open(RolesRoleFormDialogComponent, {
            panelClass: 'role-form-dialog',
            data      : {
                role: role,
                action : 'edit'
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
                    case 'save':

                        this._rolesService.updateRole(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteRole(role);

                        break;
                }
            });
        
    }

    /**
     * Delete Training
     */
    deleteRole(role): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                const DeleteRoleInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "RoleID":role.RoleID};
                
                DeleteRoleInputData.push(myInput);
                const input={
                    "MethodName" : "DeleteRole",
                    "InputStr" :  DeleteRoleInputData
                    } 
                this._rolesService.deleteRole(input);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param roleId
     */
    onSelectedChange(roleId): void
    {
        this._rolesService.toggleSelectedRole(roleId);
    }

    /**
     * Toggle star
     *
     * @param roleId
     */
    toggleStar(roleId): void
    {
        if ( this.user.starred.includes(roleId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(roleId), 1);
        }
        else
        {
            this.user.starred.push(roleId);
        }

        this._rolesService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {RolesService} _rolesService,
     * 
     */
    constructor(
        private _rolesService: RolesService
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
        return this._rolesService.onRolesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
