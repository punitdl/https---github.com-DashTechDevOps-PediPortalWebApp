import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { EcommerceSystemsComponent } from './systems/systems.component';
import { EcommerceSystemsService } from './systems/systems.service';
import { EcommerceSystemComponent } from './system/system.component';
import { EcommerceSystemService } from './system/system.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchdocComponent } from './searchdoc/searchdoc.component';
import { SearchdocService } from './searchdoc/searchdoc.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { SystemTrainingsComponent } from './system/trainings/trainings.component';




const routes: Routes = [
    {
        path     : 'systems-mnt',
        component: EcommerceSystemsComponent,
        resolve  : {
            data: EcommerceSystemsService
        }
    },
    {
        path     : 'systems/:id',
        component: EcommerceSystemComponent,
        resolve  : {
            data: EcommerceSystemService
        }
    },
    {
        path     : 'systems/:id/:handle',
        component: EcommerceSystemComponent,
        resolve  : {
            data: EcommerceSystemService
        }
    },
    {
        path     : 'searchdoc',
        component: SearchdocComponent,
        resolve  : {
            data: SearchdocService
        }
        
    }
];

@NgModule({
    declarations: [
        EcommerceSystemsComponent,
        EcommerceSystemComponent,
        SearchdocComponent,
        SystemTrainingsComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatToolbarModule,
        NgxChartsModule,
        MatStepperModule,
        BrowserAnimationsModule,
        DragDropModule,
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        EcommerceSystemsService,
        EcommerceSystemService,
        SearchdocService
    ]
})
export class SystemsMntModule
{
}
