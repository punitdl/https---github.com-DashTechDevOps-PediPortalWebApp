import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { MsalService } from '@azure/msal-angular';
import { OAuthSettings } from 'oauth';
import { Client } from '@microsoft/microsoft-graph-client';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ApiHttpService } from 'app/httpservices';
import { GlobalComponent } from 'app/global-component';

@Injectable()
export class DashboardService implements Resolve<any>
{
    constructor(
        private _httpClient: HttpClient,
        private msalService: MsalService,
        private apiClient : ApiHttpService
      ) {}

      resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
          Promise.all([
          ]).then(
            () => {
              resolve(() => {
              });
            },
            reject
          );
        });
      }

      GetBrands(): Promise<any>{
        return new Promise((resolve, reject) => {
          this.apiClient.get('api/brand/getbrands').subscribe((brands) => {
            resolve(brands);
          }, reject);
         
        });
      }
    
      GetSystems(filterData):Promise<any>{
        return new Promise((resolve, reject) => {
          this.apiClient.post('api/products/getproductsbybrand',filterData).subscribe((products) => {
            resolve(products);
          }, reject);
         
        });
      }
    
      GetRangeFilter(): Promise<any>{
        return new Promise((resolve, reject) => {
          this.apiClient.get('api/range/getrangefilters').subscribe((rangeFilters) => {
            resolve(rangeFilters);
          }, reject);
         
        });
      }

}