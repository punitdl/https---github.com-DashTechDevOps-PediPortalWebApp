import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Distributor } from 'app/main/distributors/distributor.model';

@Injectable()
export class DistributorsService implements Resolve<any>
{
    onDistributorsChanged: BehaviorSubject<any>;
    onSelectedDistributorsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onRegionFilterChanged: Subject<any>;

    distributors: Distributor[];
    user: any;
    selectedDistributors: string[] = [];
    regionfilterBy : number[] = [-1];
    searchText: string;
    filterBy: string;

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
        this.onDistributorsChanged = new BehaviorSubject([]);
        this.onSelectedDistributorsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onRegionFilterChanged = new Subject();
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
                this.getDistributors(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        
                        this.getDistributors();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getDistributors();
                    });
                    this.onRegionFilterChanged.subscribe(filter => {
                        this.regionfilterBy = filter;
                        this.getDistributors();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get distributors
     *
     * @returns {Promise<any>}
     */
    getDistributors(): Promise<any>
    {
       
        return new Promise((resolve, reject) => {
         
            const UserInputData=[];
            var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "RegionFilterIDs":this.regionfilterBy};
            
            UserInputData.push(myInput);
            const input={
                "MethodName" : "GetDistributor",
                "InputStr" :  UserInputData
                }

              
                
                //this._httpClient.get('api/distributors-distributors')
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
                    .subscribe((response: any) => {
                        var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        var jsonobj1 = JSON.parse(myObjStr1);
                   
                        if (jsonobj1.Result[0]["ErrorID"] > 0)                        {
                          var jsonStr2 ="";                   
                          for (let i = 0; i < response["Table1"].length; i++) {
                            jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }
                          var jsonobj2 = JSON.parse(jsonStr2);   
                          this.distributors =jsonobj2.Result;                     
                        }
                        else
                        {
                            this.distributors =[];
                        }
                         
                                
                        if ( this.filterBy === 'starred' )
                        {
                            this.distributors = this.distributors.filter(_distributor => {
                                return this.user.starred.includes(_distributor.DistributorID);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.distributors = this.distributors.filter(_distributor => {
                                return this.user.frequentDistributors.includes(_distributor.DistributorID);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            
                            this.distributors = FuseUtils.filterArrayByString(this.distributors, this.searchText);
                        }
                        // if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.distributors = FuseUtils.filterArrayByString(this.distributors, this.searchText);
                        // }

                        // this.distributors = this.distributors.map(distributor => {
                        //     return new Distributor(distributor);
                        // });

                        this.onDistributorsChanged.next(this.distributors);
                        resolve(this.distributors);
                    }, reject);
            }
        );
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/distributors-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected distributor by id
     *
     * @param id
     */
    toggleSelectedDistributor(id): void
    {
        // First, check if we already have that distributor as selected...
        if ( this.selectedDistributors.length > 0 )
        {
            const index = this.selectedDistributors.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedDistributors.splice(index, 1);

                // Trigger the next event
                this.onSelectedDistributorsChanged.next(this.selectedDistributors);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedDistributors.push(id);

        // Trigger the next event
        this.onSelectedDistributorsChanged.next(this.selectedDistributors);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedDistributors.length > 0 )
        {
            this.deselectDistributors();
        }
        else
        {
            this.selectDistributors();
        }
    }

    /**
     * Select distributors
     *
     * @param filterParameter
     * @param filterValue
     */
    selectDistributors(filterParameter?, filterValue?): void
    {
        this.selectedDistributors = [];

        // If there is no filter, select all distributors
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedDistributors = [];
            this.distributors.map(distributor => {
                this.selectedDistributors.push(distributor.DistributorID);
            });
        }

        // Trigger the next event
        this.onSelectedDistributorsChanged.next(this.selectedDistributors);
    }

    /**
     * Update distributor
     *
     * @param distributor
     * @returns {Promise<any>}
     */
    updateDistributor(distributor): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/distributors-distributors/' + distributor.id, {...distributor})
                .subscribe(response => {
                    this.getDistributors();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/conatacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    // this.getUserData();
                    this.getDistributors();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect distributors
     */
    deselectDistributors(): void
    {
        this.selectedDistributors = [];

        // Trigger the next event
        this.onSelectedDistributorsChanged.next(this.selectedDistributors);
    }

    /**
     * Delete distributor
     *
     * @param distributor
     *  @returns {Promise<any>}
     */
    deleteDistributor(distributor): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',distributor)
                .subscribe(response => {                   
                    this.getDistributors();
                    resolve(response);
                });
        });       
    }

     /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    deleteDistributor1(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/conatacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    // this.getUserData();
                    this.getDistributors();
                    resolve(response);
                });
        });
    }

    /**
     * Delete selected distributors
     */
    deleteSelectedDistributors(): void
    {
        for ( const distributorId of this.selectedDistributors )
        {
            const distributor = this.distributors.find(_distributor => {
                return _distributor.DistributorID === distributorId;
            });
            const distributorIndex = this.distributors.indexOf(distributor);
            this.deleteMultipleRecord(distributor);
        }
        this.onDistributorsChanged.next(this.distributors);
        this.deselectDistributors();
        this.getDistributors();
    }
    deleteMultipleRecord(distributor): void
    {
    const DeleteDistributorInputData=[];
    var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "DistributorID":distributor.DistributorID};

    DeleteDistributorInputData.push(myInput);
    const input={
    "MethodName" : "DeleteDistributor",
    "InputStr" :  DeleteDistributorInputData
    } 
       this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
    .subscribe(response => {  
    });
   }
    getRegion(UserInput): Promise<any>
    {   
     
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata);                 
                }, reject);
        });
    }
    getData(UserInput): Promise<any>
    { 
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata);                  
                }, reject);
        });
    }
    
}
