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

import { OnboardingsService } from './onboardtasks.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { DailymessagesDailymessageListComponent } from './onboardtask-list/onboardtask-list.component';

import { DailymessagesSelectedBarComponent } from './selected-bar/selected-bar.component';
import { DailymessagesMainSidebarComponent } from './sidebars/main/main.component';
import { OnboardtasksOnboardtaskFormDialogComponent } from './onboardtask-form/onboardtask.component';
import { OnboardtasksComponent } from './onboardtasks.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { OnboardtaskweekComponent } from './onboardtaskweek/onboardtaskweek.component';


const routes: Routes = [
    {
        path     : 'onboardtasks',
        component: OnboardtasksComponent,
        resolve  : {
            dailymessages: OnboardingsService
        }
    }
];

@NgModule({
    declarations   : [
        OnboardtasksComponent,
        DailymessagesDailymessageListComponent,
        DailymessagesSelectedBarComponent,
        DailymessagesMainSidebarComponent,
        OnboardtasksOnboardtaskFormDialogComponent,
        OnboardtaskweekComponent
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        TranslateModule,
        DragDropModule
    ],
    providers      : [
        OnboardingsService
    ],
    entryComponents: [
        OnboardtasksOnboardtaskFormDialogComponent
    ]
})
export class OnboardtasksModule
{
}
