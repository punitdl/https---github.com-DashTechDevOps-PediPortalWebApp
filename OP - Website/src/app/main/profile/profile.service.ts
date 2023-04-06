import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';



@Injectable({
    providedIn: 'root'
  })
export class ProfileService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    onstateid: BehaviorSubject<any>;

    
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;
    onProductChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();


        this.onstateid = new BehaviorSubject({});
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
              
               
                // this.getUserData()
            ]).then(
                () => {
                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
   
    // GetLoginCheck(UserDetails): Promise<any>
    // {
    //     console.log(UserDetails)
    //     return new Promise((resolve, reject) => {
    //         return  this._httpClient.post('http://localhost:65389/Api/User/GetAdminLoginCheck/'+UserDetails)
    //             .subscribe((response: any) => {
    //                 console.log(response);
    //                 this.onstateid.next(response);
    //                 resolve(response);
    //             }, reject);
    //     });
    // }


     
    GetUserProfile(UserDetails): Promise<any>
    {  
         
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserDetails)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata); 
                    // console.log(UserDetailsdata);
                }, reject);
        });
    }

    updateprofile(Profileinput): Promise<any>
    {     
        return new Promise((resolve) => {          
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Profileinput)
                 .subscribe(response => {
                    resolve(response);
                });
        });
    }
    

    
    
}

    