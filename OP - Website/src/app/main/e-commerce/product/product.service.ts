import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EcommerceProductService implements Resolve<any>
{
    routeParams: any;
    product: any;
    onProductChanged: BehaviorSubject<any>;
    ProductID:any;
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
        this.onProductChanged = new BehaviorSubject({});
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
                this.getProduct()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getProduct(): Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            if ( this.routeParams.ProductID === 'new' )
            {
                this.onProductChanged.next(false);
                resolve(false);
            }
            else
            {
              
                this.ProductID=this.routeParams.id;
               
                const UserInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device": "D", "ProductID": this.ProductID};
                
                UserInputData.push(myInput);
                const input={
                    "MethodName" : "GetProductDetail",
                    "InputStr" :  UserInputData
                    }
//console.log(JSON.stringify(input));
                   
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
                    .subscribe((response: any) => {
                     
                        const ProductDetailData=[];
                        var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        var jsonobj1 = JSON.parse(myObjStr1);                       
                        if (jsonobj1.Result[0]["ErrorID"] > 0)
                        {
                            var jsonStr2 ="";  
                            var jsonStr3 ="";  
                            var jsonStr4 =""; 
                            var jsonStr5="";
                            var jsonStr6="";
                                       
                          for (let i = 0; i < response["Table1"].length; i++) {
                            jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }
                          for (let i = 0; i < response["Table2"].length; i++) {
                            jsonStr3 += response["Table2"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }        
                          for (let i = 0; i < response["Table3"].length; i++) {
                            jsonStr4 += response["Table3"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }      
                          for (let i = 0; i < response["Table4"].length; i++) {
                            jsonStr5 += response["Table4"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }       
                          for (let i = 0; i < response["Table5"].length; i++) {
                            jsonStr6 += response["Table5"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }   
                        //   ////console.log(jsonStr2);
                        //   ////console.log(jsonStr3);
                        //   ////console.log(jsonStr4);
                        //   ////console.log(jsonStr5);
                        //   ////console.log(jsonStr6);
                        
                          var jsonobj2 = [];
                          if (jsonStr2 != "")
                          {
                            jsonobj2 = JSON.parse(jsonStr2);
                          }
                          var jsonobj3 = []; 
                          if (jsonStr3 != "")
                          {
                            jsonobj3 = JSON.parse(jsonStr3);
                          }  
                          var jsonobj4 = [];
                          if (jsonStr4 != "")
                          {
                            jsonobj4 = JSON.parse(jsonStr4);
                          }  
                          var jsonobj5 = []; 
                          if (jsonStr5 != "")
                          {
                            jsonobj5 = JSON.parse(jsonStr5);
                          } 
                          var jsonobj6 = [];
                          if (jsonStr6 != "")
                          {
                            jsonobj6 = JSON.parse(jsonStr6);
                          }  

                          ProductDetailData.push(jsonobj2);
                          ProductDetailData.push(jsonobj3);
                          ProductDetailData.push(jsonobj4);
                          ProductDetailData.push(jsonobj5);
                          ProductDetailData.push(jsonobj6);
                        
                          this.product = ProductDetailData;

                        //   ////console.log(this.product);
                        
                        }
                       

                      
                        this.onProductChanged.next(this.product);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save product
     *
     * @param product
     * @returns {Promise<any>}
     */
    saveProduct(product): Promise<any>
    {
        const UserInputData=[];
   
        product.Device="D";
        product.UserID=sessionStorage.getItem('UserID');
        UserInputData.push(product);
        const Productinput={
            "MethodName" : "SaveProduct",
            "InputStr" :  UserInputData
            }
            console.log(JSON.stringify(Productinput));
          return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Productinput)
            .subscribe((response: any) => {
              var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        var jsonobj1 = JSON.parse(myObjStr1);          
        if (jsonobj1.Result[0]["ErrorID"] > 0)
        {
          var jsonStr2 =""; 
          alert(jsonobj1.Result[0]["ErrorMessage"]); 
          //this.getSystem();
        }
                resolve(response);
            }, reject);
    });
    }

    /**
     * Add product
     *
     * @param product
     * @returns {Promise<any>}
     */
    addProduct(product): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-products/', product)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
    getSystems(UserInput): Promise<any>
    {   
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata); 
                    
                }, reject);
        });
    }

    DeleteProductResource(UserInput): Promise<any>
    {   
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
             console.log(UserDetailsdata);
                    resolve(UserDetailsdata); 
                    
                }, reject);
        });
    }

    getBrands(UserInput): Promise<any>
    {   
        
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata); 
                  
                }, reject);
        });
    }
    getResourceType(UserInput): Promise<any>
    {   
        // //console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((ResourceTypesdata) => {
                    resolve(ResourceTypesdata); 
                     ////console.log(ResourceTypesdata);
                }, reject);
        });
    }
    getAnatomy(UserInput): Promise<any>
    {   
        
        // //console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Anatomydata) => {
                    resolve(Anatomydata); 
                    // //console.log(Anatomydata);
                }, reject);
        });
    }
    getDisease(UserInput): Promise<any>
    {   
        
        // //console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Diseasesdata) => {
                    resolve(Diseasesdata); 
                  //   //console.log(Diseasesdata);
                }, reject);
        });
    }
}
