import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DiseasesDiseaseFormDialogComponent } from '../disease-form/diseaseform.component';
import { DiseasesService } from '../diseases.service';


@Component({
    selector     : 'diseases-disease-list',
    templateUrl  : './disease-list.component.html',
    styleUrls    : ['./disease-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DiseasesDiseaseListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    diseases: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'categoryname', 'trainingname', 'nos', 'buttons'];
    selectedDiseases: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._diseasesService);
        console.log(this.dataSource);
        this._diseasesService.onDiseasesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(diseases => {
                this.diseases = diseases;

                this.checkboxes = {};
                diseases.map(disease => {
                    this.checkboxes[disease.id] = false;
                });
            });

        this._diseasesService.onSelectedDiseasesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDiseases => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedDiseases.includes(id);
                }
                this.selectedDiseases = selectedDiseases;
            });

        this._diseasesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._diseasesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._diseasesService.deselectDiseases();
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
     * Edit disease
     *
     * @param disease
     */
    editTraining(disease): void
    {
        this.dialogRef = this._matDialog.open(DiseasesDiseaseFormDialogComponent, {
            panelClass: 'disease-form-dialog',
            data      : {
                disease: disease,
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

                        this._diseasesService.updateTraining(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteTraining(disease);

                        break;
                }
            });
    }

    /**
     * Delete disease
     */
    deleteTraining(disease): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._diseasesService.deleteTraining(disease);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param diseaseId
     */
    onSelectedChange(diseaseId): void
    {
        this._diseasesService.toggleSelectedDisease(diseaseId);
    }

    /**
     * Toggle star
     *
     * @param diseaseId
     */
    toggleStar(diseaseId): void
    {
        if ( this.user.starred.includes(diseaseId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(diseaseId), 1);
        }
        else
        {
            this.user.starred.push(diseaseId);
        }

        this._diseasesService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {DiseasesService} _diseasesService
     */
    constructor(
        private _diseasesService: DiseasesService
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
        return this._diseasesService.onDiseasesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
