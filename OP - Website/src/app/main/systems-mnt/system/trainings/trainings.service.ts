import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Training } from './training.model';


@Injectable()
export class TrainingsService implements Resolve<any>
{
    onTrainingsChanged: BehaviorSubject<any>;
    onSelectedTrainingsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    trainings: Training[];
    user: any;
    selectedTrainings: string[] = [];

    searchText: string;
    filterBy: string;

    Category: any[];

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
        this.onTrainingsChanged = new BehaviorSubject([]);
        this.onSelectedTrainingsChanged = new BehaviorSubject([]);
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
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getTrainings(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getTrainings();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getTrainings();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get trainings
     *
     * @returns {Promise<any>}
     */
    getTrainings(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const UserInputData=[];
            var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D"};
            
            UserInputData.push(myInput);
            const logininput={
                "MethodName" : "GetTrainingMaterial",
                "InputStr" :  UserInputData
                }
                
               
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',logininput)
     
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
                          this.trainings = jsonobj2.Result;
                         
                        }                       
                        else
                        {
                            this.trainings = [];
                          
                        }
                       

                        if ( this.filterBy === 'starred' )
                        {
                            this.trainings = this.trainings.filter(_training => {
                                return this.user.starred.includes(_training.TrainingMaterialID);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.trainings = this.trainings.filter(_training => {
                                return this.user.frequentTrainings.includes(_training.TrainingMaterialID);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.trainings = FuseUtils.filterArrayByString(this.trainings, this.searchText);
                        }

                        // this.trainings = this.trainings.map(training => {
                        //     return new Training(training);
                        // });

                        this.onTrainingsChanged.next(this.trainings);
                        resolve(this.trainings);
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
                this._httpClient.get('api/trainings-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected training by id
     *
     * @param id
     */
    toggleSelectedTraining(id): void
    {
        // First, check if we already have that training as selected...
        if ( this.selectedTrainings.length > 0 )
        {
            const index = this.selectedTrainings.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedTrainings.splice(index, 1);

                // Trigger the next event
                this.onSelectedTrainingsChanged.next(this.selectedTrainings);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedTrainings.push(id);

        // Trigger the next event
        this.onSelectedTrainingsChanged.next(this.selectedTrainings);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedTrainings.length > 0 )
        {
            this.deselectTrainings();
        }
        else
        {
            this.selectTrainings();
        }
    }

    /**
     * Select trainings
     *
     * @param filterParameter
     * @param filterValue
     */
    selectTrainings(filterParameter?, filterValue?): void
    {
        this.selectedTrainings = [];

       

        // If there is no filter, select all trainings
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedTrainings = [];
            this.trainings.map(Training => {
                this.selectedTrainings.push(Training.TrainingMaterialID);
            });
        }

        // Trigger the next event
        this.onSelectedTrainingsChanged.next(this.selectedTrainings);
    }

    /**
     * Update training
     *
     * @param training
     * @returns {Promise<any>}
     */
    updateTraining(training, treeviewselected): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const UserInputData=[];            
            training.Device="D";
            training.SelectedModule = treeviewselected;           
            training.UserID=sessionStorage.getItem('UserID');  

            UserInputData.push(training);             
            const Traininginput={
                "MethodName" : "SaveTrainingMaterial",
                "InputStr" :  UserInputData
                }
               
                //console.log(JSON.stringify(Traininginput))

           
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Traininginput)
                .subscribe((response: any) => {
                    var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);          
            if (jsonobj1.Result[0]["ErrorID"] > 0)
            {
              var jsonStr2 ="";     

            alert(jsonobj1.Result[0]["ErrorMessage"]); 
                    this.getTrainings();
            }
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
            this._httpClient.post('api/trainings-user/' + this.user.id, {...userData})
                .subscribe(response => {
                 
                    this.getTrainings();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect trainings
     */
    deselectTrainings(): void
    {
        this.selectedTrainings = [];

        // Trigger the next event
        this.onSelectedTrainingsChanged.next(this.selectedTrainings);
        this.getTrainings();
    }

    /**
     * Delete training
     *
     * @param training
     */
    deleteTraining1(training): void
    {
        const trainingIndex = this.trainings.indexOf(training);
        this.trainings.splice(trainingIndex, 1);
        this.onTrainingsChanged.next(this.trainings);
    }

     /**
     * Delete distributor
     *
     * @param training
     * @returns {Promise<any>}
     */
    deleteTraining(training): Promise<any>
    {        
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',training)
                .subscribe(response => {                   
                    this.getTrainings();
                    resolve(response);
                });
        });       
    }

    /**
     * Delete selected trainings
     */
    deleteSelectedTrainings(): void
    {
        for ( const trainingId of this.selectedTrainings )
        {
            const training = this.trainings.find(_training => {
                return _training.TrainingMaterialID === trainingId;
            });
            const trainingIndex = this.trainings.indexOf(training);
            //this.trainings.splice(trainingIndex, 1);
            this.deleteMultipleRecord(training);
        }
        this.onTrainingsChanged.next(this.trainings);
        this.deselectTrainings();
        this.getTrainings();
    }

    deleteMultipleRecord(training): void
    {
    const DeleteTrainingInputData=[];
    var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "TrainingMaterialID":training.TrainingMaterialID};
    DeleteTrainingInputData.push(myInput);
    const input={
    "MethodName" : "DeleteTrainingMaterial",
    "InputStr" :  DeleteTrainingInputData
    }   
    this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
    .subscribe(response => {          
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

}
