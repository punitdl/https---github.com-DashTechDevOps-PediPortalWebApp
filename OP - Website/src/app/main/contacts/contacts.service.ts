import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/contacts/contact.model';
import { sub } from 'date-fns';

@Injectable()
export class ContactsService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    onDepartmentFilterChanged: Subject<any>;

    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;
    departmentfilterBy : number[] = [-1];

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
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
        this.onDepartmentFilterChanged = new Subject();
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
                this.getContacts(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts();
                    });

                    this.onDepartmentFilterChanged.subscribe(filter => {
                        this.departmentfilterBy = filter;
                        this.getContacts();
                    });


                    

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
        return new Promise((resolve, reject) => {
           
            const UserInputData=[];
            var myInput = {
                 "UserID":sessionStorage.getItem('UserID'),
                 "Device": "D",
                 "DepartmentFilterIDs": this.departmentfilterBy
                };
            UserInputData.push(myInput);
            const logininput={
                "MethodName" : "GetContacts",
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
                          this.contacts = jsonobj2.Result;                    
                        }
                        else
                        {
                            this.contacts=[];
                        }
                      

                      

                        if ( this.filterBy === 'starred' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.starred.includes(_contact.ContactID);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.ContactID);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        }

                        
                        // this.contacts = this.contacts.map(contact => {
                        //     return new Contact(contact);
                        // });

                        this.onContactsChanged.next(this.contacts);
                        resolve(this.contacts);
                    }, reject);
            }
        );
    }

    getDepartments(UserInput): Promise<any>
    {   
        // console.log(UserDetails);
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',UserInput)
           .subscribe((UserDetailsdata) => {
                    resolve(UserDetailsdata); 
                   
                }, reject);
        });
    }


    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/contacts-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedContacts.length > 0 )
        {
            const index = this.selectedContacts.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedContacts.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void
    {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.contacts.map(contact => {
                this.selectedContacts.push(contact.ContactID);
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/contacts-contacts/' + contact.id, {...contact})
                .subscribe(response => {
                    this.getContacts();
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
            this._httpClient.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                 
                    this.getContacts();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void
    {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact1(contact): void
    {
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void
    {
        for ( const contactId of this.selectedContacts )
        {
            const contact = this.contacts.find(_contact => {
                return _contact.ContactID === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            //this.contacts.splice(contactIndex, 1);
            this.deleteMultipleRecord(contact);
        }
        this.onContactsChanged.next(this.contacts);
        this.deselectContacts();
        this.getContacts();
    }
    deleteMultipleRecord(contact): void
    {
    const DeleteContactInputData=[];
    var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D", "ContactID":contact.ContactID};

    DeleteContactInputData.push(myInput);
    const input={
    "MethodName" : "DeleteContact",
    "InputStr" :  DeleteContactInputData
    } 
       this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',input)
    .subscribe(response => {  
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
     * @param contacts
     *  @returns {Promise<any>}
     */
    deleteContact(contacts): Promise<any>
    {        
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',contacts)
                .subscribe(response => {                   
                    this.getContacts();
                    resolve(response);
                });
        });       
    }

}
