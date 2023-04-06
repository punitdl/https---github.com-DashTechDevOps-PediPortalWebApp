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


import { CasecoveragesSelectedBarComponent } from './selected-bar/selected-bar.component';
import { CaseCoverageMainSidebarComponent } from './sidebars/main/main.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { AudittrailsComponent } from './audittrails.component';
import { AuditTrailsService } from './audittrails.service';
import { AuditTrailsListComponent } from './audittrails-list/audittrails-list.component';
import { AuditTrailsFormDialogComponent } from './audittrails-form/audittrails.component';






const routes: Routes = [
    {
        path     : 'audittrails',
        component: AudittrailsComponent,
        resolve  : {
            systems: AuditTrailsService
        }
    }
];

@NgModule({
    declarations   : [
        AudittrailsComponent,
        AuditTrailsListComponent,
        CasecoveragesSelectedBarComponent,
        CaseCoverageMainSidebarComponent,
        AuditTrailsFormDialogComponent
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
        TranslateModule
    ],
    providers      : [
        AuditTrailsService
    ],
    entryComponents: [
        AuditTrailsFormDialogComponent
    ]
})
export class AuditTrailsModule
{
}
