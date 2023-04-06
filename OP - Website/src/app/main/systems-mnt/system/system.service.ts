import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EcommerceSystemService implements Resolve<any>
{
    routeParams: any;
    system: any;
    onSystemChanged: BehaviorSubject<any>;
    SystemID:any;
    ImageURL:string;
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
                this.getSystem()
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
    getSystem(): Promise<any>
    {
       
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onSystemChanged.next(false);
                resolve(false);
            }
            else
            {
                
                this.SystemID=this.routeParams.id;
               
                const UserInputData=[];
                var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device": "D", "SystemID": this.SystemID};
                
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
                          var jsonStr2 ="";  
                          var jsonStr3 ="";  
                          var jsonStr4 =""; 
                          var jsonStr5="";
                          var jsonStr6="";
                          var jsonStr7="";
                                          
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
                          for (let i = 0; i < response["Table6"].length; i++) {
                            jsonStr7 += response["Table6"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }   
                          //console.log(jsonStr2);
                          //console.log(jsonStr3);
                          //console.log(jsonStr4);
                          //console.log(jsonStr5);
                          //console.log(jsonStr6);
                          //console.log(jsonStr7);
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
                          var jsonobj7 = [];
                          if (jsonStr7 != "")
                          {
                            jsonobj7 = JSON.parse(jsonStr7);
                          }
                        

                        //   console.log(jsonobj2)
                        //   console.log(jsonobj3)
                        //   console.log(jsonobj4)
                        //   console.log(jsonobj5)

                          SystemDetailData.push(jsonobj2);
                          SystemDetailData.push(jsonobj3);
                          SystemDetailData.push(jsonobj4);
                          SystemDetailData.push(jsonobj5);
                          SystemDetailData.push(jsonobj6);
                          SystemDetailData.push(jsonobj7);

                      //   console.log(JSON.stringify(SystemDetailData));

                         this.system = SystemDetailData;
                        
                        }
                        this.onSystemChanged.next(this.system);
                        resolve(response);
                    }, reject);
            }
        });
    }

    UpdateSystem(system,selectedFile)
    {

      if(selectedFile)
      {                 
      const uploadData = new FormData();
      uploadData.append('myFile',selectedFile, selectedFile.name);
      uploadData.append('Module', 'System');
      uploadData.append('ID', '');
      uploadData.append('SaveFolder', 'System');
      this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
      })
      .subscribe(response => {
          var Success=response[1];
          if(Success==="Success"){
              this.ImageURL=response[2];
              this.saveSystem(system,this.ImageURL);
          }
      });       
      }
      else{
          this.saveSystem(system,this.ImageURL);
      }
  }


    /**
     * Save system
     *
     * @param system
     * @returns {Promise<any>}
     */
    saveSystem(system,ImageURL): Promise<any>
    {      
      if(ImageURL === undefined)
      {
          ImageURL=system.ImageURL;
      }  

        //  console.log(JSON.stringify(Systeminput));
        return new Promise((resolve, reject) => {
          const UserInputData=[];   
          system.ImageURL=ImageURL;
              system.Device="D";
              system.UserID=sessionStorage.getItem('UserID');
              UserInputData.push(system);
              const Systeminput={
              "MethodName" : "SaveSystem",
              "InputStr" :  UserInputData
              }      
          this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Systeminput)
                .subscribe((response: any) => {
                  var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);          
            if (jsonobj1.Result[0]["ErrorID"] > 0)
            {
              var jsonStr2 ="";              
              alert(jsonobj1.Result[0]["ErrorMessage"]); 
              this.getSystem();
            }
                    resolve(response);
                }, reject);
        });
    }

    DeleteSystemResource(UserInput): Promise<any>
    {   
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
             console.log(UserDetailsdata);
                    resolve(UserDetailsdata); 
                    
                }, reject);
        });
    }
    /**
     * Add system
     *
     * @param system
     * @returns {Promise<any>}
     */
    addSystem(system): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-systems/', system)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getBrand(UserInput): Promise<any>
    {   
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata); 
                    // console.log(UserDetailsdata);
                }, reject);
        });
    }
    getResourceType(UserInput): Promise<any>
    {   
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((ResourceTypesdata) => {
                    resolve(ResourceTypesdata); 
                     //console.log(ResourceTypesdata);
                }, reject);
        });
    }
    getAnatomy(UserInput): Promise<any>
    {   
        
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Anatomydata) => {
                    resolve(Anatomydata); 
                    // console.log(Anatomydata);
                }, reject);
        });
    }
    getDisease(UserInput): Promise<any>
    {   
        
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Diseasesdata) => {
                    resolve(Diseasesdata); 
                  //   console.log(Diseasesdata);
                }, reject);
        });
    }
    GetProcedure(UserInput): Promise<any>
    {   
        
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Diseasesdata) => {
                    resolve(Diseasesdata); 
                  //   console.log(Diseasesdata);
                }, reject);
        });
    }

    GetTraining(UserInput): Promise<any>
    {   
        
        console.log(UserInput);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Diseasesdata) => {
                    resolve(Diseasesdata); 
                  //   console.log(Diseasesdata);
                }, reject);
        });
    }
    getData(UserInput): Promise<any>
    {         
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((Diseasesdata) => {
                    resolve(Diseasesdata);               
                }, reject);
        });
    }
    onUpload(selectedFile,EventID) {
      // upload code goes here
      const uploadData = new FormData();
      uploadData.append('myFile',selectedFile, selectedFile.name);
      uploadData.append('Module', 'System');
      uploadData.append('ID', EventID);
      uploadData.append('SaveFolder', 'System');
      this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
        reportProgress: true,
        observe: 'events'
  
      })
        .subscribe(event => {
          console.log(event); // handle event here
        });
    }
  
}
