import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { TrainingsService } from 'app/main/trainings/trainings.service';
import { TrainingsTrainingFormDialogComponent } from '../training-form/trainingform.component';


@Component({
    selector: 'trainings-training-list',
    templateUrl: './training-list.component.html',
    styleUrls: ['./training-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TrainingsTrainingListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    trainings: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['TrainingSource', 'TrainingMaterialName', 'LinkURL', 'buttons'];
    selectedTrainings: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._trainingsService);

        this._trainingsService.onTrainingsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(trainings => {
                this.trainings = trainings;
                this.checkboxes = {};
                trainings.map(training => {
                    this.checkboxes[training.TrainingMaterialID] = false;
                });
            });

        this._trainingsService.onSelectedTrainingsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTrainings => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedTrainings.includes(id);
                }
                this.selectedTrainings = selectedTrainings;
            });

        this._trainingsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._trainingsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._trainingsService.deselectTrainings();
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
     * Edit training
     *
     * @param training
     */
    editTraining(training): void {
        console.log(training)
        this.dialogRef = this._matDialog.open(TrainingsTrainingFormDialogComponent, {
            panelClass: 'training-form-dialog',
            data: {
                training: training,
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

                        //  this._trainingsService.updateTraining(formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteTraining(training);
                        break;
                }
            });
    }

    /**
     * Delete Training
     */
    deleteTraining(training): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const DeleteTrainingInputData = [];
                var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "TrainingMaterialID": training.TrainingMaterialID };

                DeleteTrainingInputData.push(myInput);
                const input = {
                    "MethodName": "DeleteTrainingMaterial",
                    "InputStr": DeleteTrainingInputData
                }
                this._trainingsService.deleteTraining(input);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param trainingId
     */
    onSelectedChange(trainingId): void {
        this._trainingsService.toggleSelectedTraining(trainingId);
    }

    /**
     * Toggle star
     *
     * @param trainingId
     */
    toggleStar(trainingId): void {
        if (this.user.starred.includes(trainingId)) {
            this.user.starred.splice(this.user.starred.indexOf(trainingId), 1);
        }
        else {
            this.user.starred.push(trainingId);
        }

        this._trainingsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {TrainingsService} _trainingsService
     */
    constructor(
        private _trainingsService: TrainingsService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._trainingsService.onTrainingsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
