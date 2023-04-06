import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductgridComponent } from './productgrid.component';
import { ProductgridService } from './productgrid.service';
import { MatDialogModule } from '@angular/material/dialog';

const routes = [
    {
        path     : 'productgrid',
        component: ProductgridComponent,
        resolve  : {
            contacts: ProductgridService
        }
    }
];

@NgModule({
    declarations: [
        ProductgridComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        TranslateModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatDividerModule,
        MatListModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatTreeModule,
        MatCheckboxModule,
        MatTableModule,
        MatDialogModule,
        FuseSharedModule
    ],
    providers      : [
        ProductgridService
    ],
    exports     : [
        ProductgridComponent
    ]
})

export class ProductgridModule
{
}
