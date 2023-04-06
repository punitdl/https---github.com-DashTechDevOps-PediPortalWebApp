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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { RolesMainSidebarComponent } from './sidebars/main/main.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { RolesComponent } from './roles.component';
import { RolesService } from './roles.service';
import { RolesRoleListComponent } from './role-list/role-list.component';
import { RolesRoleFormDialogComponent } from './role-form/roleform.component';
import { RolesSelectedBarComponent } from './selected-bar/selected-bar.component';


const routes: Routes = [
    {
        path     : 'roles',
        component: RolesComponent,
        resolve  : {
            trainings: RolesService
        }
    }
];

@NgModule({
    declarations   : [
        RolesComponent,
        RolesRoleListComponent,
        RolesSelectedBarComponent,
        RolesMainSidebarComponent,
        RolesRoleFormDialogComponent
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
        TranslateModule,
        MatSlideToggleModule
    ],
    providers      : [
        RolesService
    ],
    entryComponents: [
        RolesRoleFormDialogComponent
    ]
})
export class RolesModule
{
}
