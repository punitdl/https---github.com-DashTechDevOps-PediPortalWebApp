import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, NoPreloading, RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductgridModule } from './main/productgrid/productgrid.module';
import { FakeDbService } from './fake-db/fake-db.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { Sample2Module } from './main/sample2/sample2.module';
import { EcommerceModule } from './main/e-commerce/e-commerce.module';
import { CalendarModule } from './main/calendar/calendar.module';
import { TrainingsModule } from './main/trainings/trainings.module';
import { DailymessagesModule } from './main/dailymessages/dailymessages.module';
import { CaseCoverageModule } from './main/casecoverage/casecoverages.module';
import { DiseasesModule } from './main/disease/diseases.module';
import { ContactsModule } from './main/contacts/contacts.module';
import { DistributorsModule } from './main/distributors/distributors.module';
import { UsermanagementsModule } from './main/usermanagements/usermanagements.module';
import { ScrumboardModule } from './main/scrumboard/scrumboard.module';
import { SystemsMntModule } from './main/systems-mnt/systems-mnt.module';
import { LoginModule } from './main/login/login.module';
import { ForgotPasswordModule } from './main/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './main/reset-password/reset-password.module';
import { ProfileModule } from './main/profile/profile.module';
import { RolesModule } from './main/roles/roles.module';
import { OnboardtasksModule } from './main/onboardtasks/onboardtasks.module';
import { AuditTrailsModule } from './main/audittrails/audittrails.module';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { OAuthSettings } from 'oauth';
import { DashboardModule } from './main/dashboard/dashboard.module';



const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
//import { ProductMasterModule } from './main/productmaster/productmaster.module';
const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: NoPreloading,
    relativeLinkResolution: 'legacy',
    useHash: true

};

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'login'
    },
    {
        path: 'Events',
        loadChildren: () => import('./main/calendar/calendar.module').then(m => m.CalendarModule)
    },
    {
        path: 'e-commerce',
        loadChildren: () => import('./main/e-commerce/e-commerce.module').then(m => m.EcommerceModule)
    },
    {
        path: 'systems-mnt',
        loadChildren: () => import('./main/systems-mnt/systems-mnt.module').then(m => m.SystemsMntModule)
    },
    {
        path: 'trainings',
        loadChildren: () => import('./main/trainings/trainings.module').then(m => m.TrainingsModule)
    },
    {
        path: 'dailymessages',
        loadChildren: () => import('./main/dailymessages/dailymessages.module').then(m => m.DailymessagesModule)
    },
    {
        path: 'casecoverage',
        loadChildren: () => import('./main/casecoverage/casecoverages.module').then(m => m.CaseCoverageModule)
    },
    {
        path: 'disease',
        loadChildren: () => import('./main/disease/diseases.module').then(m => m.DiseasesModule)
    },

    {
        path: 'contacts',
        loadChildren: () => import('./main/contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path: 'distributors',
        loadChildren: () => import('./main/distributors/distributors.module').then(m => m.DistributorsModule)
    },

    {
        path: 'usermanagements',
        loadChildren: () => import('./main/usermanagements/usermanagements.module').then(m => m.UsermanagementsModule)
    },
    {
        path: 'scrumboard',
        loadChildren: () => import('./main/scrumboard/scrumboard.module').then(m => m.ScrumboardModule)
    },
    {
        path: 'roles',
        loadChildren: () => import('./main/roles/roles.module').then(m => m.RolesModule)
    },
    {
        path: 'onboardtasks',
        loadChildren: () => import('./main/onboardtasks/onboardtasks.module').then(m => m.OnboardtasksModule)
    },
    {
        path: 'audittrails',
        loadChildren: () => import('./main/audittrails/audittrails.module').then(m => m.AuditTrailsModule)
    },
    {
        path: 'sample2',
        loadChildren: () => import('./main/sample2/sample2.module').then(m => m.Sample2Module)
    },

    {
        path: 'sample',
        loadChildren: () => import('./main/sample/sample.module').then(m => m.SampleModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule)
    },

];

@NgModule({
    declarations: [
        AppComponent

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        
        HttpClientModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatStepperModule,
        MatDividerModule,
        MatListModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatTreeModule,
        MatCheckboxModule,
        // App modules
        LayoutModule,
        SampleModule,
        ProductgridModule,
        EcommerceModule,
        SystemsMntModule,
        CalendarModule,
        TrainingsModule,
        DailymessagesModule,
        CaseCoverageModule,
        DiseasesModule,
        ContactsModule,
        DistributorsModule,
        UsermanagementsModule,
        ScrumboardModule,
        Sample2Module,
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,
        ProfileModule,
        RolesModule,
        OnboardtasksModule,
        HttpClientModule,
        AuditTrailsModule,
        DashboardModule,
        MsalModule.forRoot(
            {
                auth: {
                    clientId: OAuthSettings.appId,
                    redirectUri: OAuthSettings.redirectUri,
                    //   authority: "https://login.microsoftonline.com/" + OAuthSettings.tenantId,
                    authority: "https://login.microsoftonline.com/common"
                },
                cache: {
                    cacheLocation: "localStorage",
                    storeAuthStateInCookie: true
                },
            })
        // MsalModule.forRoot({
        //     auth: {
        //       clientId: OAuthSettings.appId,
        //       redirectUri: OAuthSettings.redirectUri
        //     }
        //   })

    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        }
    ]
})
export class AppModule {
}
