import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ProductFakeDb } from 'app/fake-db/productgrid';
import { SystemsFakeDb } from 'app/fake-db/systems';
import { ECommerceFakeDb } from './e-commerce';
import { FaqFakeDb } from './faq';
import { CalendarFakeDb } from './calendar';
import { TrainingsFakeDb } from './trainings';
import { DailymessagesFakeDb } from './dailymessages';
import { CasecoveragesFakeDb } from './casecoverage';
import { DiseasesFakeDb } from './diseases';
import { ContactsFakeDb } from './contacts';
import { UsermanagementsFakeDb } from './usermanagements';
import { DistributorsFakeDb } from './distributors';
import { ScrumboardFakeDb } from './scrumboard';
import { CommonFakeDb }from './common';
import { SystemsMntFakeDb } from './systems-mnt';
import { RolesFakeDb } from './roles';

export class FakeDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            
            // Calendar
            'calendar': CalendarFakeDb.data,


            'systems-systems': SystemsFakeDb.systems,
            'systems-user'    : SystemsFakeDb.user,
            'systems-categorydata': SystemsFakeDb.categorylist,

            'systems-systemlist': SystemsFakeDb.systemList,

            'products-productsgrid': SystemsFakeDb.productsgrid,

             // E-Commerce
             'e-commerce-products' : ECommerceFakeDb.products,
             'e-commerce-orders'   : ECommerceFakeDb.orders,

             'trainings-trainings': TrainingsFakeDb.trainings,
             'trainings-user'    : TrainingsFakeDb.user,
             'trainings-categorydata': TrainingsFakeDb.categorylist,
             'trainings-sourcedata': TrainingsFakeDb.sourcelist,

             'dailymessages-dailymessages': DailymessagesFakeDb.dailymessages,
            'dailymessages-user'    : SystemsFakeDb.user,
            'dailymessages-categorydata': SystemsFakeDb.categorylist,

            'casecoverage-casecoverage':CasecoveragesFakeDb.casecoverage,
            'casecoverage-surgeonlist':CasecoveragesFakeDb.surgeonlist,
            'casecoverage-hospitallist':CasecoveragesFakeDb.hospitallist,
            'casecoverage-representativelist':CasecoveragesFakeDb.representativelist,

            'diseases-diseases': DiseasesFakeDb.diseases,
            'diseases-user'    : DiseasesFakeDb.user,
            'diseases-categorydata': DiseasesFakeDb.categorylist,
            'diseases-sourcedata': DiseasesFakeDb.sourcelist,
            // Contacts
            'contacts-contacts': ContactsFakeDb.contacts,
            'contacts-user'    : ContactsFakeDb.user,
            'contacts-contactslist'    : ContactsFakeDb.contactslist,
            'common-statelist':CommonFakeDb.statelist,
            'common-departmentlist':CommonFakeDb.departmentlist,
            'common-regionlist':CommonFakeDb.regionlist,
            'common-teamlist':CommonFakeDb.teamlist,
            'common-rolelist':CommonFakeDb.rolelist,
            'common-distributorlist':CommonFakeDb.distributorlist,
			'common-statefilterlist':CommonFakeDb.statefilterlist,
            'common-departmentfilterlist':CommonFakeDb.departmentfilterlist,
            'common-regionfilterlist':CommonFakeDb.regionfilterlist,
            'common-teamfilterlist':CommonFakeDb.teamfilterlist,
            'common-rolefilterlist':CommonFakeDb.rolefilterlist,
            'common-distributorfilterlist':CommonFakeDb.distributorfilterlist,
            'common-brandlist':CommonFakeDb.brandlist,
            'common-brandlistfilter':CommonFakeDb.brandlistfilter,
            'common-systemfilterlist':CommonFakeDb.systemfilterlist,
            'common-systemlist':CommonFakeDb.systemlist,
            // E-Commerce
            'e-commerce-systems' : SystemsMntFakeDb.systems,
            'roles-roles': RolesFakeDb.roles,
             'roles-user'    : RolesFakeDb.user,
             'roles-categorydata': RolesFakeDb.categorylist,
             'roles-sourcedata': RolesFakeDb.sourcelist,
            
            
            
//usermanagements
'usermanagements-usermanagements': UsermanagementsFakeDb.usermanagements,
'usermanagements-user'    : UsermanagementsFakeDb.user,

//distributors
'distributors-distributors': DistributorsFakeDb.distributors,
'distributors-user'    : DistributorsFakeDb.user,

'scrumboard-boards': ScrumboardFakeDb.boards,

             
             // FAQ
            'faq': FaqFakeDb.data,
            


        };
    }
}
