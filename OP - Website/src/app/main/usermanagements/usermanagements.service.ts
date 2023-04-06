import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Usermanagement } from 'app/main/usermanagements/usermanagement.model';

@Injectable()
export class UsermanagementsService implements Resolve<any>
{
    onUsermanagementsChanged: BehaviorSubject<any>;
    onSelectedUsermanagementsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    onRoleFilterChanged: Subject<any>;
    onRegionFilterChanged: Subject<any>;
    onDistributorFilterChanged: Subject<any>;
    usermanagements: Usermanagement[];
    user: any;
    selectedUsermanagements: string[] = [];

    searchText: string;
    searchTextflag:boolean=false;
    filterBy: string;
    searchRole: string;
    rolefilterBy : number[] = [-1];
    regionfilterBy : number[] = [-1];
    distributorfilterBy : number[] = [-1];
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
        this.onUsermanagementsChanged = new BehaviorSubject([]);
        this.onSelectedUsermanagementsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
       // this.onRoleChanged = new Subject();
        this.onRoleFilterChanged = new Subject();
        this.onRegionFilterChanged = new Subject();
        this.onDistributorFilterChanged = new Subject();
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
                this.getUsermanagements(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                     
                        this.searchText = searchText;
                        this.getUsermanagements();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUsermanagements();
                    });
                    this.onRoleFilterChanged.subscribe(filter => {
                        this.rolefilterBy = filter;
                        this.getUsermanagements();
                    });
                    this.onRegionFilterChanged.subscribe(filter => {                      
                        this.regionfilterBy = filter;
                        this.getUsermanagements();
                    });
                    this.onDistributorFilterChanged.subscribe(filter => {
                        this.distributorfilterBy = filter;
                        this.getUsermanagements();
                    });
                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get usermanagements
     *
     * @returns {Promise<any>}
     */
    getUsermanagements(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const UserInputData=[];
            var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D",
            "RoleFilterIDs": this.rolefilterBy,
            "RegionFilterIDs": this.regionfilterBy,
            "DistributorFilterIDs": this.distributorfilterBy};
            
            UserInputData.push(myInput);
            const input={
                "MethodName" : "GetUser",
                "InputStr" :  UserInputData
                }

                console.log(JSON.stringify(input));
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
          
                    .subscribe((response: any) => {
                        console.log(response);
                        var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        var jsonobj1 = JSON.parse(myObjStr1);                     
                        if (jsonobj1.Result[0]["ErrorID"] > 0)
                        {
                          var jsonStr2 ="";                   
                          for (let i = 0; i < response["Table1"].length; i++) {
                            jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }
                          var jsonobj2 = JSON.parse(jsonStr2);
                          this.usermanagements =jsonobj2.Result;
                         // console.log(JSON.stringify(jsonobj2.Result));
                        }
                        else
                        {
                            this.usermanagements =[];
                        }                    
                        if ( this.filterBy === 'starred' )
                        {
                            this.usermanagements = this.usermanagements.filter(_usermanagement => {
                                return this.user.starred.includes(_usermanagement.EditUserID);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.usermanagements = this.usermanagements.filter(_usermanagement => {
                                return this.user.frequentUsermanagements.includes(_usermanagement.EditUserID);
                            });
                        }

                        if ( this.searchText && this.searchText !== '')
                        {
                            this.usermanagements = FuseUtils.filterArrayByString(this.usermanagements, this.searchText);
                        }
                       

                        // this.usermanagements = this.usermanagements.map(usermanagement => {
                        //     return new Usermanagement(usermanagement);
                        // });

                        this.onUsermanagementsChanged.next(this.usermanagements);
                        resolve(this.usermanagements);
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
                this._httpClient.get('api/usermanagements-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected usermanagement by id
     *
     * @param id
     */
    toggleSelectedUsermanagement(id): void
    {
        // First, check if we already have that usermanagement as selected...
        if ( this.selectedUsermanagements.length > 0 )
        {
            const index = this.selectedUsermanagements.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedUsermanagements.splice(index, 1);

                // Trigger the next event
                this.onSelectedUsermanagementsChanged.next(this.selectedUsermanagements);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUsermanagements.push(id);

        // Trigger the next event
        this.onSelectedUsermanagementsChanged.next(this.selectedUsermanagements);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedUsermanagements.length > 0 )
        {
            this.deselectUsermanagements();
        }
        else
        {
            this.selectUsermanagements();
        }
    }

    /**
     * Select usermanagements
     *
     * @param filterParameter
     * @param filterValue
     */
    selectUsermanagements(filterParameter?, filterValue?): void
    {
        this.selectedUsermanagements = [];

        // If there is no filter, select all usermanagements
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedUsermanagements = [];
            this.usermanagements.map(usermanagement => {
                this.selectedUsermanagements.push(usermanagement.EditUserID);
            });
        }

        // Trigger the next event
        this.onSelectedUsermanagementsChanged.next(this.selectedUsermanagements);
    }

    /**
     * Update usermanagement
     *
     * @param usermanagement
     * @returns {Promise<any>}
     */
    updateUsermanagement(usermanagement,ImageURL): Promise<any>
    {

        console.log(ImageURL)
        console.log(usermanagement)
        if(ImageURL === undefined)
        {
            ImageURL=usermanagement.ProfileURL;
        }     
        console.log(usermanagement)
        return new Promise((resolve, reject) => {
            const UserInputData=[];       
            usermanagement.ProfileURL=ImageURL;
            usermanagement.Device="D";
            usermanagement.UserID=sessionStorage.getItem('UserID');
       
            UserInputData.push(usermanagement);             
            const Userinput={
                "MethodName" : "SaveUser",
                "InputStr" :  UserInputData
                }
                

                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Userinput)
                .subscribe((response: any) => {
                    var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);
                   
                    if (jsonobj1.Result[0]["ErrorID"] > 0)
                    {
                        var jsonStr2 ="";   
                        alert(jsonobj1.Result[0]["ErrorMessage"]);
                        this.getUsermanagements();
                    }
                    resolve(response);
                });
        });
    }

    updateUser(dailymessage,selectedFile)
    {
        if(selectedFile)
        {                 
        const uploadData = new FormData();
        uploadData.append('myFile',selectedFile, selectedFile.name);
        uploadData.append('Module', 'User');
        uploadData.append('ID', '');
        uploadData.append('SaveFolder', 'User');
        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
        })
        .subscribe(response => {
            var Success=response[1];
            if(Success==="Success"){
                this.ImageURL=response[2];
                this.updateUsermanagement(dailymessage,this.ImageURL);
            }
        });       
        }
        else{
            this.updateUsermanagement(dailymessage,this.ImageURL);
        }
    }


    onUpload(selectedFile,UserID) {
        // upload code goes here
        const uploadData = new FormData();
        uploadData.append('myFile',selectedFile, selectedFile.name);
        uploadData.append('Module', 'User');
        uploadData.append('ID', UserID);
        uploadData.append('SaveFolder', 'User');
        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
          reportProgress: true,
          observe: 'events'
    
        })
          .subscribe(event => {
            console.log(event); // handle event here
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
                    this.getUsermanagements();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect usermanagements
     */
    deselectUsermanagements(): void
    {
        this.selectedUsermanagements = [];

        // Trigger the next event
        this.onSelectedUsermanagementsChanged.next(this.selectedUsermanagements);
    }

    /**
     * Delete usermanagement
     *
     * @param usermanagement
     */
    deleteUsermanagement1(usermanagement): void
    {
        const usermanagementIndex = this.usermanagements.indexOf(usermanagement);
        this.usermanagements.splice(usermanagementIndex, 1);
        this.onUsermanagementsChanged.next(this.usermanagements);
    }
    /**
     * Delete distributor
     *
     * @param usermanagement
     *  @returns {Promise<any>}
     */
    deleteUsermanagement(usermanagement): Promise<any>
    {  
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',usermanagement)
                .subscribe(response => {                   
                    this.getUsermanagements();
                    resolve(response);
                });
        });       
    }

    /**
     * Delete selected usermanagements
     */
    deleteSelectedUsermanagements(): void
    {
        for ( const usermanagementId of this.selectedUsermanagements )
        {
            const usermanagement = this.usermanagements.find(_usermanagement => {
                return _usermanagement.EditUserID === usermanagementId;
            });
            const usermanagementIndex = this.usermanagements.indexOf(usermanagement);
            this.usermanagements.splice(usermanagementIndex, 1);
        }
        this.onUsermanagementsChanged.next(this.usermanagements);
        this.deselectUsermanagements();
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
   

}
