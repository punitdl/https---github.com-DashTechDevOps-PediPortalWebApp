import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class EcommerceProductsService implements Resolve<any>
{
    products: any[];
    onProductsChanged: BehaviorSubject<any>;
    onBrandFilterChanged: Subject<any>;
    onSystemFilterChanged: Subject<any>;
    brandfilterBy  : number[] = [-1];
    systemfilterBy:number[] = [-1];
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
        this.onProductsChanged = new BehaviorSubject({});
        this.onBrandFilterChanged = new Subject();
        this.onSystemFilterChanged = new Subject();
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
        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getProducts()
            ]).then(
                () => {
                    this.onBrandFilterChanged.subscribe(filter => {
                        this.brandfilterBy = filter; 
                                       
                        this.getProducts();
                    });
                    this.onSystemFilterChanged.subscribe(filter => {
                        this.systemfilterBy = filter; 
                                       
                        this.getProducts();
                    });
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProducts(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const UserInputData=[];
            var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device": "D", "BrandFilterIDs":this.brandfilterBy,"SystemFilterIDs":this.systemfilterBy};
            
            UserInputData.push(myInput);
            const input={
                "MethodName" : "GetProduct",
                "InputStr" :  UserInputData
                }
              // //////console.log(JSON.stringify(input));
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
         
                .subscribe((response: any) => {
                    var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);                       
                    if (jsonobj1.Result[0]["ErrorID"] > 0)
                    {
                      var jsonStr2 ="";                  
                      for (let i = 0; i < response["Table1"].length; i++) {
                        jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                      }
                      var jsonobj2 = JSON.parse(jsonStr2);      
                      this.products = jsonobj2.Result; 
                      
                      
                    }
                    else
                    {
                        this.products = [];
                       // alert(jsonobj1.Result[0]["ErrorMessage"]); 
                    }                   
                    this.onProductsChanged.next(this.products);
                    resolve(response);
                }, reject);
        });
    }

    deleteProduct(product): void
    {
        const productIndex = this.products.indexOf(product);
        this.products.splice(productIndex, 1);
        this.onProductsChanged.next(this.products);
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
