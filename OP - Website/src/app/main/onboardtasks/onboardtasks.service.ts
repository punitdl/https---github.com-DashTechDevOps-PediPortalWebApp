import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Onboardtask } from './onboardtask.model';


@Injectable()
export class OnboardingsService implements Resolve<any>
{
    onDailymessagesChanged: BehaviorSubject<any>;
    onSelectedDailymessagesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    dailymessages: Onboardtask[];
    user: any;
    selectedDailymessages: string[] = [];

    searchText: string;
    filterBy: string;

    Category: any[];
    NewSubTask:any[];
    id: any;
   
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
        this.onDailymessagesChanged = new BehaviorSubject([]);
        this.onSelectedDailymessagesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
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
                this.GetOnBoardingTasks(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.GetOnBoardingTasks();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.GetOnBoardingTasks();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get dailymessages
     *
     * @returns {Promise<any>}
     */
    GetOnBoardingTasks(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
            const UserInputData=[];
            var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D"};
            
            UserInputData.push(myInput);
            const logininput={
                "MethodName" : "GetOnBoardingTask",
                "InputStr" :  UserInputData
                }
                
                console.log(JSON.stringify(logininput));
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',logininput)
              //this._httpClient.get(' http://localhost:65389/Api/OP/Sample_CRUD?UserID='+UserID)
                    .subscribe((response: any) => {
                        var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        var jsonobj1 = JSON.parse(myObjStr1);
                        // console.log(jsonobj1);
                        if (jsonobj1.Result[0]["ErrorID"] > 0)
                        {
                          var jsonStr2 ="";
                          for (let i = 0; i < response["Table1"].length; i++) {
                            jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                          }
                          var jsonobj2 = JSON.parse(jsonStr2);
                          this.dailymessages = jsonobj2.Result;
                        }
                        else
                        {
                            this.dailymessages = [];
                            alert(jsonobj1.Result[0]["ErrorMessage"]); 
                        }
                        
                        //  console.log(this.dailymessages);
                       // this.dailymessages = response;
                      
                        // if ( this.filterBy === 'starred' )
                        // {
                        //     this.dailymessages = this.dailymessages.filter(_dailymessage => {
                        //         return this.user.starred.includes(_dailymessage.id);
                        //     });
                        // }

                        // if ( this.filterBy === 'frequent' )
                        // {
                        //     this.dailymessages = this.dailymessages.filter(_dailymessage => {
                        //         return this.user.frequentDailymessages.includes(_dailymessage.id);
                        //     });
                        // }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.dailymessages = FuseUtils.filterArrayByString(this.dailymessages, this.searchText);
                        }

                        // this.dailymessages = this.dailymessages.map(dailymessage => {
                        //     return new Dailymessage(dailymessage);
                        // });

                        this.onDailymessagesChanged.next(this.dailymessages);
                        resolve(this.dailymessages);
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
                this._httpClient.get('api/dailymessages-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected dailymessage by id
     *
     * @param id
     */
    toggleSelectedDailymessage(id): void
    {
        // First, check if we already have that dailymessage as selected...
        if ( this.selectedDailymessages.length > 0 )
        {
            const index = this.selectedDailymessages.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedDailymessages.splice(index, 1);

                // Trigger the next event
                this.onSelectedDailymessagesChanged.next(this.selectedDailymessages);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedDailymessages.push(id);

        // Trigger the next event
        this.onSelectedDailymessagesChanged.next(this.selectedDailymessages);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedDailymessages.length > 0 )
        {
            this.deselectDailymessages();
        }
        else
        {
            this.selectDailymessages();
        }
    }

    /**
     * Select dailymessages
     *
     * @param filterParameter
     * @param filterValue
     */
    selectDailymessages(filterParameter?, filterValue?): void
    {
        this.selectedDailymessages = [];

        // If there is no filter, select all dailymessages
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedDailymessages = [];
            this.dailymessages.map(dailymessage => {
               // this.selectedDailymessages.push(dailymessage.MessageID);
            });
        }

        // Trigger the next event
        this.onSelectedDailymessagesChanged.next(this.selectedDailymessages);
    }

    /**
     * Update dailymessage
     *
     * @param onboardingtask
     * @returns {Promise<any>}
     */
    updateOnboardingTask(onboardingtask,OnBoardingID): Promise<any>
    {
        return new Promise((resolve, reject) => {
        this.NewSubTask=onboardingtask;
        const UserInputData=[{
            "Device": "D",
            "UserID": sessionStorage.getItem('UserID'),
            "OnBoardingID": OnBoardingID,
            "OnBoarding": onboardingtask
        }]
        const Taskinput={
            "MethodName" : "SaveOnBoardingTask",
            "InputStr" :  UserInputData
            }           
            console.log(JSON.stringify(Taskinput));
        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Taskinput)
                      
           .subscribe((response: any) => {
            var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
          
            if (jsonobj1.Result[0]["ErrorID"] > 0)
            {
              var jsonStr2 ="";
            alert(jsonobj1.Result[0]["ErrorMessage"]);
             this.GetOnBoardingTasks();
            }
              resolve(response);
           });
        });
    }

    SaveOnboarding(Onboarding): Promise<any>
    {
    
        return new Promise((resolve, reject) => {
            const UserInputData=[];
          
            Onboarding.Device="D";
            Onboarding.UserID=sessionStorage.getItem('UserID');
            UserInputData.push(Onboarding);
            const Onboardinginput={
                "MethodName" : "SaveOnBoarding",
                "InputStr" :  UserInputData
                }

                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Onboardinginput)
           // this._httpClient.post('api/dailymessages-dailymessages/' + dailymessage.id, {...dailymessage})
                .subscribe(response => {
                    console.log(response);
                    this.GetOnBoardingTasks();
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
            this._httpClient.post('api/dailymessages-user/' + this.user.id, {...userData})
                .subscribe(response => {
                 //   this.getUserData();
                    this.GetOnBoardingTasks();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect dailymessages
     */
    deselectDailymessages(): void
    {
        this.selectedDailymessages = [];

        // Trigger the next event
        this.onSelectedDailymessagesChanged.next(this.selectedDailymessages);
    }

    /**
     * Delete dailymessage
     *
     * @param dailymessage
     */
    deleteDailymessage1(dailymessage): void
    {
        const dailymessageIndex = this.dailymessages.indexOf(dailymessage);
        this.dailymessages.splice(dailymessageIndex, 1);
        this.onDailymessagesChanged.next(this.dailymessages);
    }

    /**
     * Delete distributor
     *
     * @param OnBoarding
     * @returns {Promise<any>}
     */
    deleteOnBoarding(OnBoarding): Promise<any>
    {  
        console.log(JSON.stringify(OnBoarding));
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',OnBoarding)
                .subscribe(response => {                   
                    this.GetOnBoardingTasks();
                    resolve(response);
                });
        });       
    }
      /**
     * Delete distributor
     *
     * @param OnBoardingTask
     * @returns {Promise<any>}
     */
    deleteOnBoardingTask(OnBoardingTask): Promise<any>
    {  
        console.log(JSON.stringify(OnBoardingTask));
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',OnBoardingTask)
                .subscribe(response => {                   
                    this.GetOnBoardingTasks();
                    resolve(response);
                });
        });       
    }

    /**
     * Delete selected dailymessages
     */
    deleteSelectedDailymessages(): void
    {
        for ( const dailymessageId of this.selectedDailymessages )
        {
            const dailymessage = this.dailymessages.find(_dailymessage => {
              //  return _dailymessage.MessageID === dailymessageId;
            });
            const dailymessageIndex = this.dailymessages.indexOf(dailymessage);

            console.log(dailymessage);
            this.deleteMultipleRecord(dailymessage);
        }
        this.onDailymessagesChanged.next(this.dailymessages);
        this.deselectDailymessages();
        this.GetOnBoardingTasks();
    }
    deleteMultipleRecord(dailymessage): void
    {
    const DeleteMessageInputData=[];
    var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "DailyMessageID":dailymessage.MessageID};

    DeleteMessageInputData.push(myInput);
    const input={
    "MethodName" : "DeleteDailyMessage",
    "InputStr" :  DeleteMessageInputData
    } 
       this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
    .subscribe(response => {  
    });
   }
    getRole(UserInput): Promise<any>
    {   
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata); 
                  //   console.log(UserDetailsdata);
                }, reject);
        });
    }

}
