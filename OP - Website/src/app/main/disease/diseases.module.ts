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

import { DiseasesService } from './diseases.service';

import { DiseasesSelectedBarComponent } from './selected-bar/selected-bar.component';
import { DiseasesMainSidebarComponent } from './sidebars/main/main.component';
import { DiseasesDiseaseFormDialogComponent } from './disease-form/diseaseform.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { DiseasesComponent } from '../disease/diseases.component';
import { DiseasesDiseaseListComponent } from './disease-list/disease-list.component';



const routes: Routes = [
    {
        path     : 'disease',
        component: DiseasesComponent,
        resolve  : {
            diseases: DiseasesService
        }
    }
];

@NgModule({
    declarations   : [
        DiseasesComponent,
        DiseasesDiseaseListComponent,
        DiseasesSelectedBarComponent,
        DiseasesMainSidebarComponent,
        DiseasesDiseaseFormDialogComponent
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
        DiseasesService
    ],
    entryComponents: [
        DiseasesDiseaseFormDialogComponent
    ]
})
export class DiseasesModule
{
}
