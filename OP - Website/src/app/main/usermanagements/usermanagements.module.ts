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
import { MatSortModule } from '@angular/material/sort';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { UsermanagementsComponent } from 'app/main/usermanagements/usermanagements.component';
import { UsermanagementsService } from 'app/main/usermanagements/usermanagements.service';
import { UsermanagementsUsermanagementListComponent } from 'app/main/usermanagements/usermanagement-list/usermanagement-list.component';
import { UsermanagementsSelectedBarComponent } from 'app/main/usermanagements/selected-bar/selected-bar.component';
import { UsermanagementsMainSidebarComponent } from 'app/main/usermanagements/sidebars/main/main.component';
import { UsermanagementsUsermanagementFormDialogComponent } from 'app/main/usermanagements/usermanagement-form/usermanagement-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [
    {
        path     : 'usermanagements',
        component: UsermanagementsComponent,
        resolve  : {
            usermanagements: UsermanagementsService
        }
    }
];

@NgModule({
    declarations   : [
        UsermanagementsComponent,
        UsermanagementsUsermanagementListComponent,
        UsermanagementsSelectedBarComponent,
        UsermanagementsMainSidebarComponent,
        UsermanagementsUsermanagementFormDialogComponent
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatSelectModule,
         MatSlideToggleModule
    ],
    providers      : [
        UsermanagementsService
    ],
    entryComponents: [
        UsermanagementsUsermanagementFormDialogComponent
    ]
})
export class UsermanagementsModule
{
}
