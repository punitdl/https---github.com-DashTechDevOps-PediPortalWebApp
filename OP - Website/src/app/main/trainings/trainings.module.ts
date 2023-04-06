import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { TrainingsComponent } from './trainings.component';
import { TrainingsService } from './trainings.service';
import { TrainingsTrainingListComponent } from './training-list/training-list.component';
import { TrainingsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { TrainingsMainSidebarComponent } from './sidebars/main/main.component';
import { TrainingsTrainingFormDialogComponent } from './training-form/trainingform.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';


const routes: Routes = [
    {
        path     : 'trainings',
        component: TrainingsComponent,
        resolve  : {
            trainings: TrainingsService
        }
    }
];

@NgModule({
    declarations   : [
        TrainingsComponent,
        TrainingsTrainingListComponent,
        TrainingsSelectedBarComponent,
        TrainingsMainSidebarComponent,
        TrainingsTrainingFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatSelectModule,
        MatChipsModule,
        MatTreeModule,
        
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        TranslateModule
    ],
    providers      : [
        TrainingsService
    ],
    entryComponents: [
        TrainingsTrainingFormDialogComponent
    ]
})
export class TrainingsModule
{
}
