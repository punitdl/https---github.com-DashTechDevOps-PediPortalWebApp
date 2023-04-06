import { FuseNavigation } from '@fuse/types';
import { Component, OnDestroy, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Directive } from '@angular/core';
import {  Subject } from 'rxjs';
import { NavigationService } from './navigation.service';
import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
@Directive()
export class NavigationComponent implements OnInit,OnDestroy {
    private _unsubscribeAll: Subject<any>;
    menu:any[];
    menuitems:[ 
            
                    {
                        id       : 'dailymessages',
                        title    : 'Daily Message',
                        type     : 'item',
                        icon     : 'message',
                        url      : '/dailymessages'
                    }
                ];
    navigation:any;
  //  dataSource: FilesDataSource | null;
    /**
   * Constructor
   
   @param {NavigationService} _navigationService  */
    constructor(
        private _navigationService: NavigationService,     
        private _http: HttpClient
    ){ 
       
       
        const NavigationInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        NavigationInputData.push(myInput);
        const MenuSourceInput = {
          "MethodName": "GetMenu",
          "InputStr": NavigationInputData
        }
console.log(JSON.stringify(MenuSourceInput));
         this._navigationService.GetNavigation().then((data) => {
            console.log(data);
        });
        // this._navigationService.GetNavigation(MenuSourceInput).then((data) => {
        //    console.log(data);
        //   var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        //   var jsonobj1 = JSON.parse(myObjStr1);
        //   if (jsonobj1.Result[0]["ErrorID"] > 0) {
        //     var jsonStr2 = "";
        //     for (let i = 0; i < data["Table1"].length; i++) {
        //       jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        //     }
        //     var jsonobj2 = JSON.parse(jsonStr2);
        //     console.log(jsonobj2);
        //     // this.SourceListItems = jsonobj2.Result;

        //     // console.log(this.SourceListItems);
        //   }
        // });
    }
    ngOnInit(): void {
        alert("init");
   
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

// function disp():[] { 
    
//     const NavigationInputData = [];
//         var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
//         NavigationInputData.push(myInput);
//         const MenuSourceInput = {
//           "MethodName": "GetMenu",
//           "InputStr": NavigationInputData
//         }

//         //  this._navigationService.GetNavigation().then((data) => {
//         //     console.log(data);
//         //     this.menu=data;
//         // });
//         this.menu= [ 
            
//             {
//                 id       : 'dailymessages',
//                 title    : 'Daily Message',
//                 type     : 'item',
//                 icon     : 'message',
//                 url      : '/dailymessages'
//             }
//         ]

//     return this.menu;
//     console.log(this.menu);
//  }
 const childMenu= [ 
            
                {
                    id       : 'dailymessages',
                    title    : 'Daily Message',
                    type     : 'item',
                    icon     : 'message',
                    url      : '/dailymessages'
                },
    
                {
                    id       : 'systems',
                    title    : 'System',
                    type     : 'item',
                    icon     : 'ac_unit',
                    url      : '/systems-mnt'
                },
            //      {
    		// id       : 'product',
    		// title    : 'Product',		
    		// type     : 'item',
    		// icon     : 'shopping_basket',
    		// url      : '/e-commerce'
            //      },
    
                {
                    id       : 'trainings',
                    title    : 'Training Material',               
                    type     : 'item',
                    icon     : 'folder_open',
                    url      : '/trainings'
                },
              
                {
                    id       : 'casecoverage',
                    title    : 'Case Coverage',
                    type     : 'item',
                    icon     : 'work_outline',
                    url      : '/casecoverage'
                },
                {
                    id       : 'usermanagements',
                    title    : 'User',
                    type     : 'item',
                    icon     : 'account_box',
                    url      : '/usermanagements'
                },
                {
                    id       : 'roles',
                    title    : 'Role',
                    type     : 'item',
                    icon     : 'verified_user',
                    url      : '/roles'
                },   
                {
                    id       : 'onboardtasks',
                    title    : 'On-Boarding Task',
                    type     : 'item',
                    icon     : 'assignment_turned_in',
                    url      : '/onboardtasks'
                },
                     
    
                {
                    id       : 'events',
                    title    : 'Global Events',                
                    type     : 'item',
                    icon     : 'event',
                    url      : '/calendar'
                },
                {
                    id       : 'distributors',
                    title    : 'Distributor',
                    type     : 'item',
                    icon     : 'perm_contact_calendar',
                    url      : '/distributors'
                },
               
                {
                    id       : 'contacts',
                    title    : 'Contacts',
                    type     : 'item',
                    icon     : 'contacts',
                    url      : '/contacts'
                },
            ];
// //export const navigation: FuseNavigation[] =MenuRights;
const MenuRights=[];
 const childMenuRights=[];
    var myInput = { "id": 'applications', "title": "Master Control","type": 'group',"children" :childMenu };
    
    MenuRights.push(myInput);
    export const navigation: FuseNavigation[] =MenuRights;
 
// export const navigation: FuseNavigation[] = [
//     {
//         id       : 'applications',
//         title    : 'Master Control',
//         type     : 'group',        
//         children : [ 
            
//             {
//                 id       : 'dailymessages',
//                 title    : 'Daily Message',
//                 type     : 'item',
//                 icon     : 'message',
//                 url      : '/dailymessages'
//             },

//             {
//                 id       : 'systems',
//                 title    : 'System',
//                 type     : 'item',
//                 icon     : 'ac_unit',
//                 url      : '/systems-mnt'
//             },
//         //      {
// 		// id       : 'product',
// 		// title    : 'Product',		
// 		// type     : 'item',
// 		// icon     : 'shopping_basket',
// 		// url      : '/e-commerce'
//         //      },

//             {
//                 id       : 'trainings',
//                 title    : 'Training Material',               
//                 type     : 'item',
//                 icon     : 'folder_open',
//                 url      : '/trainings'
//             },
          
//             {
//                 id       : 'casecoverage',
//                 title    : 'Case Coverage',
//                 type     : 'item',
//                 icon     : 'work_outline',
//                 url      : '/casecoverage'
//             },
//             {
//                 id       : 'usermanagements',
//                 title    : 'User',
//                 type     : 'item',
//                 icon     : 'account_box',
//                 url      : '/usermanagements'
//             },
//             {
//                 id       : 'roles',
//                 title    : 'Role',
//                 type     : 'item',
//                 icon     : 'verified_user',
//                 url      : '/roles'
//             },   
//             {
//                 id       : 'onboardtasks',
//                 title    : 'On-Boarding Task',
//                 type     : 'item',
//                 icon     : 'assignment_turned_in',
//                 url      : '/onboardtasks'
//             },
                 

//             {
//                 id       : 'events',
//                 title    : 'Global Events',                
//                 type     : 'item',
//                 icon     : 'event',
//                 url      : '/calendar'
//             },
//             {
//                 id       : 'distributors',
//                 title    : 'Distributor',
//                 type     : 'item',
//                 icon     : 'perm_contact_calendar',
//                 url      : '/distributors'
//             },
           
//             {
//                 id       : 'contacts',
//                 title    : 'Contacts',
//                 type     : 'item',
//                 icon     : 'contacts',
//                 url      : '/contacts'
//             },
            
//         ]


//     }
// ];

//export const navigation:FuseNavigation[] = [];