import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { audittrails } from './audittrails.model';


@Injectable()
export class AuditTrailsService implements Resolve<any>
{
    onCasecoveragesChanged: BehaviorSubject<any>;
    onSelectedDiseasesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onRepresentativeFilterChanged: Subject<any>;
    onSurgeonFilterChanged: Subject<any>;
    onDateChangedLoad: Subject<any>;
    
    casecoverages: audittrails[];
    user: any;
    selectedDiseases: string[] = [];

    searchText: string;
    filterBy: string;

    Category: any[];
    representativefilterBy : '-1';
    surgeonfilterBy :'-1';
    StartDatefilterBy : null;
    EndDatefilterBy : null;
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
        this.onCasecoveragesChanged = new BehaviorSubject([]);
        this.onSelectedDiseasesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onRepresentativeFilterChanged = new Subject();
        this.onSurgeonFilterChanged = new Subject();
        this.onDateChangedLoad= new Subject();
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
                this.getCasecoverages(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getCasecoverages();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getCasecoverages();
                    });
                    this.onRepresentativeFilterChanged.subscribe(filter => {
                        this.representativefilterBy = filter;

                       
                        this.getCasecoverages();
                    });
                    this.onSurgeonFilterChanged.subscribe(filter => {
                        this.surgeonfilterBy = filter;
                        this.getCasecoverages();
                    });
                    this.onDateChangedLoad.subscribe(filter => {
                        this.StartDatefilterBy=filter[0];
                        this.EndDatefilterBy=filter[1];
                        this.getCasecoverages();
                    });                    
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get systems
     *
     * @returns {Promise<any>}
     */
    getCasecoverages(): Promise<any>
    {
        return new Promise((resolve, reject) => {
         
            const CaseInputData=[];
            var CaseInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D","RepresentativeID":this.representativefilterBy,"SurgeonID": this.surgeonfilterBy,"HospitalID":-1,"StartDate":this.StartDatefilterBy,"EndDate":this.EndDatefilterBy};
            
            CaseInputData.push(CaseInput);
            const input={
                "MethodName" : "GetCaseCoverage",
                "InputStr" :  CaseInputData
                }

           //console.log(JSON.stringify(input));
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
                      this.casecoverages =jsonobj2.Result;                       
                    }
                    else
                    {
                        this.casecoverages=[];

                    }

                        if ( this.filterBy === 'starred' )
                        {
                            this.casecoverages = this.casecoverages.filter(_casecoverage => {
                                return this.user.starred.includes(_casecoverage.CaseCoverageID);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.casecoverages = this.casecoverages.filter(_casecoverage => {
                                return this.user.frequentSystems.includes(_casecoverage.CaseCoverageID);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.casecoverages = FuseUtils.filterArrayByString(this.casecoverages, this.searchText);
                        }

                        this.casecoverages = this.casecoverages.map(coverage => {
                            return new audittrails(coverage);
                        });

                        this.onCasecoveragesChanged.next(this.casecoverages);
                        resolve(this.casecoverages);
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
                this._httpClient.get('api/systems-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected system by id
     *
     * @param id
     */
    toggleSelectedSystem(id): void
    {
        // First, check if we already have that system as selected...
        if ( this.selectedDiseases.length > 0 )
        {
            const index = this.selectedDiseases.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedDiseases.splice(index, 1);

                // Trigger the next event
                this.onSelectedDiseasesChanged.next(this.selectedDiseases);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedDiseases.push(id);

        // Trigger the next event
        this.onSelectedDiseasesChanged.next(this.selectedDiseases);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedDiseases.length > 0 )
        {
          //  this.deselectDiseases();
        }
        else
        {
            this.selectCasecoverages();
        }
    }

    /**
     * Select systems
     *
     * @param filterParameter
     * @param filterValue
     */
    selectCasecoverages(filterParameter?, filterValue?): void
    {
        this.selectedDiseases = [];

        // If there is no filter, select all systems
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedDiseases = [];
            this.casecoverages.map(disease => {
                this.selectedDiseases.push(disease.CaseCoverageID);
            });
        }

        // Trigger the next event
        this.onSelectedDiseasesChanged.next(this.selectedDiseases);
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
