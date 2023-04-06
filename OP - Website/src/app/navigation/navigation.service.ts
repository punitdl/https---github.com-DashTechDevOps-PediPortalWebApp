import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class NavigationService implements Resolve<any>
{
    routeParams: any;
    system: any;
    onSystemChanged: BehaviorSubject<any>;
    SystemID:any;
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
        this.onSystemChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise<void>((resolve, reject) => {

            Promise.all([
               this.getNavigationMenu()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get system
     *
     * @returns {Promise<any>}
     */
    getNavigationMenu(): Promise<any>
    {
      const NavigationInputData = [];
      var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
      NavigationInputData.push(myInput);
      const MenuSourceInput = {
        "MethodName": "GetMenu",
        "InputStr": NavigationInputData
      }
        return new Promise((resolve, reject) => { 
                const UserInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device": "D"};
                
                UserInputData.push(myInput);
                const input={
                    "MethodName" : "GetSystemDetail",
                    "InputStr" :  UserInputData
                    }
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
                    .subscribe((response: any) => {
                        const SystemDetailData=[];
                        var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        var jsonobj1 = JSON.parse(myObjStr1);                       
                        if (jsonobj1.Result[0]["ErrorID"] > 0)
                        {
                          
                         this.system = SystemDetailData;
                        
                        }
                        this.onSystemChanged.next(this.system);
                        resolve(response);
                    }, reject);
            
        });
    }

    GetNavigation(): Promise<any>
    {   
      const NavigationInputData = [];
      var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
      NavigationInputData.push(myInput);
      const MenuSourceInput = {
        "MethodName": "GetMenu",
        "InputStr": NavigationInputData
      }
     
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',MenuSourceInput)
           .subscribe((Diseasesdata) => {
                    resolve(Diseasesdata); 
                  //   console.log(Diseasesdata);
                }, reject);
        });
    }

    }
