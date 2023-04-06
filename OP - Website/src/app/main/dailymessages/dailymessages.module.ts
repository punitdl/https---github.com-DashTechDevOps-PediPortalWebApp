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

import { DailymessagesService } from './dailymessages.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { DailymessagesDailymessageListComponent } from './dailymessage-list/dailymessage-list.component';
import { DailymessagesComponent } from './dailymessages.component';
import { DailymessagesSelectedBarComponent } from './selected-bar/selected-bar.component';
import { DailymessagesMainSidebarComponent } from './sidebars/main/main.component';
import { DailymessagesDailymessageFormDialogComponent } from './dailymessage-form/dailymessage.component';

import { MatPaginatorModule } from '@angular/material/paginator';
const routes: Routes = [
    {
        path: 'dailymessages',
        component: DailymessagesComponent,
        resolve: {
            dailymessages: DailymessagesService
        }
    }
];

@NgModule({
    declarations: [
        DailymessagesComponent,
        DailymessagesDailymessageListComponent,
        DailymessagesSelectedBarComponent,
        DailymessagesMainSidebarComponent,
        DailymessagesDailymessageFormDialogComponent
    ],
    imports: [
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
        MatPaginatorModule
    ],
    providers: [
        DailymessagesService
    ],
    entryComponents: [
        DailymessagesDailymessageFormDialogComponent
    ]
})
export class DailymessagesModule {
}
