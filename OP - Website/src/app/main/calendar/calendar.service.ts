import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { addDays, addHours, endOfDay, endOfMonth, startOfDay, subDays } from 'date-fns';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated: Subject<any>;
    ImageURL:string; 
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient,
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _httpClient: HttpClient,
        public _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.onEventsUpdated = new Subject();
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
                this.getEvents()
            ]).then(
                ([events]: [any]) => {
                   // resolve();
                },
                reject
            );
        });
    }

    // /**
    //  * Get events
    //  *
    //  * @returns {Promise<any>}
    //  */
    // getEvents1h(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {

    //         this._httpClient.get('api/calendar/events')
    //             .subscribe((response: any) => {
    //                 this.events = response.data;
    //                 this.onEventsUpdated.next(this.events);
    //                 resolve(this.events);
    //             }, reject);
    //     });
    // }

     /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(): Promise<any>
    {
        
        return new Promise((resolve, reject) => {
            const UserInputData=[];
            var myInput = {
                 "UserID":sessionStorage.getItem('UserID'),
                 "Device": "D"
                };
            UserInputData.push(myInput);
            const Eventinput={
                "MethodName" : "GetEvent",
                "InputStr" :  UserInputData
                }    
   
                this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Eventinput)
                .subscribe((response: any) => {
                    //this.events = response.data;
                    var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);                    
                    if (jsonobj1.Result[0]["ErrorID"] > 0)
                    {
                        
                      var jsonStr2 ="";                    
                      for (let i = 0; i < response["Table2"].length; i++) {
                        jsonStr2 += response["Table2"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                      }
                      var jsonobj2 = JSON.parse(jsonStr2);    
                      this.events = jsonobj2.Result;                              
                    }
                    else
                    {
                      this.events=[];  
                    }
                  
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
        });
    }

    UpdateEvent(events:any,id,selectedFile)
    {
        if(selectedFile)
        {                 
        const uploadData = new FormData();
        uploadData.append('myFile',selectedFile, selectedFile.name);
        uploadData.append('Module', 'Events');
        uploadData.append('ID', '');
        uploadData.append('SaveFolder', 'Events');
        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
        })
        .subscribe(response => {
            var Success=response[1];
            if(Success==="Success"){
                this.ImageURL=response[2];
                this.updateEvents(events,id,this.ImageURL);

            
            }
        });       
        }
        else{
            this.updateEvents(events,id,this.ImageURL);
        }
    }


    /**
     * Update events
     * 
     * @param events
     * @returns {Promise<any>}
     */
    updateEvents(events,id,ImageURL): Promise<any>
    {
        console.log(events.meta.eventImage);
        
        if(ImageURL === undefined)
        {
            ImageURL=events.meta.eventImage;
        } 
        const UserInputData=[];
        events.meta.eventImage=ImageURL;

        console.log(events.meta);
        
        var myInput = {
             "UserID":sessionStorage.getItem('UserID'),
             "Device": "D",
             "start":events.start,
             "end":events.end,
             "meta":events.meta,
            "title":events.title,
            "EventID":id
            };
        UserInputData.push(myInput);
        const Eventinput={
            "MethodName" : "SaveEvent",
            "InputStr" :  UserInputData
            }    
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Eventinput)
            // this._httpClient.post('api/calendar/events', {
            //     id  : 'events',
            //     data: [...events]
            // })
                .subscribe((response: any) => {
                    var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
          
            if (jsonobj1.Result[0]["ErrorID"] > 0)
            {
              var jsonStr2 ="";
                      
            alert(jsonobj1.Result[0]["ErrorMessage"]);  
            
            this._matDialog.closeAll();
                    
            this.getEvents();
            }
                  
                }, reject);
        });
    }

    onUpload(selectedFile,EventID) {
        // upload code goes here
        const uploadData = new FormData();
        uploadData.append('myFile',selectedFile, selectedFile.name);
        uploadData.append('Module', 'Events');
        uploadData.append('ID', EventID);
        uploadData.append('SaveFolder', 'Events');
        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
          reportProgress: true,
          observe: 'events'
    
        })
          .subscribe(event => {
            console.log(event); // handle event here
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
     /**
     * Delete distributor
     *
     * @param event
     * @returns {Promise<any>}
     */
    deleteEvent(event): Promise<any>
    {  
       // //console.log(event);
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',event)
                .subscribe(response => {                   
                    this.getEvents();
                    resolve(response);
                });
        });       
    }

}
