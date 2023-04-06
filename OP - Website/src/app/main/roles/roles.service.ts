import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Role } from './role.model';



@Injectable()
export class RolesService implements Resolve<any>
{
    onRolesChanged: BehaviorSubject<any>;
    onSelectedRolesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    modules: [];
    roles: Role[];
    user: any;
    selectedRoles: string[] = [];

    searchText: string;
    filterBy: string;

    Category: any[];
    searchTextflag: boolean = false;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onRolesChanged = new BehaviorSubject([]);
        this.onSelectedRolesChanged = new BehaviorSubject([]);
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getRoles(),
                //  this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getRoles();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getRoles();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get roles
     *
     * @returns {Promise<any>}
     */
    getRoles(): Promise<any> {
        return new Promise((resolve, reject) => {

            const UserInputData = [];
            var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };

            UserInputData.push(myInput);
            const input = {
                "MethodName": "GetRole",
                "InputStr": UserInputData
            }
            //this._httpClient.get('api/roles-roles')
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure', input)
                .subscribe((response: any) => {
                    var myObjStr1 = response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);
                    if (jsonobj1.Result[0]["ErrorID"] > 0) {
                        var jsonStr2 = "";
                        for (let i = 0; i < response["Table1"].length; i++) {
                            jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        }
                        var jsonobj2 = JSON.parse(jsonStr2);
                        this.roles = jsonobj2.Result;
                        //this.searchTextflag=false;           
                    }
                    else {
                        this.roles = [];
                        //  alert(jsonobj1.Result[0]["ErrorMessage"]); 
                    }
                    if (this.searchText && this.searchText !== '') {
                        alert(this.searchText);
                        this.roles = FuseUtils.filterArrayByString(this.roles, this.searchText);
                    }

                    // this.roles = this.roles.map(role => {
                    //     return new Role(role);
                    // });

                    this.onRolesChanged.next(this.roles);
                    resolve(this.roles);
                    // console.log(this.roles);
                }, reject);
        }
        );
    }


    getModules(Userinput): Promise<any> {
        return new Promise((resolve, reject) => {


            //this._httpClient.get('api/roles-roles')
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure', Userinput)
                .subscribe((response: any) => {
                    var myObjStr1 = response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);
                    if (jsonobj1.Result[0]["ErrorID"] > 0) {
                        var jsonStr2 = "";
                        for (let i = 0; i < response["Table1"].length; i++) {
                            jsonStr2 += response["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                        }
                        var jsonobj2 = JSON.parse(jsonStr2);
                    }
                    this.modules = jsonobj2.Result;
                    //  console.log(this.modules);


                    resolve(this.modules);
                    //console.log(this.modules);
                }, reject);
        }
        );
    }


    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/roles-user/5725a6802d10e277a0f35724')
                .subscribe((response: any) => {
                    this.user = response;
                    this.onUserDataChanged.next(this.user);
                    resolve(this.user);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected role by id
     *
     * @param id
     */
    toggleSelectedRole(id): void {
        // First, check if we already have that role as selected...
        if (this.selectedRoles.length > 0) {
            const index = this.selectedRoles.indexOf(id);

            if (index !== -1) {
                this.selectedRoles.splice(index, 1);

                // Trigger the next event
                this.onSelectedRolesChanged.next(this.selectedRoles);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedRoles.push(id);

        // Trigger the next event
        this.onSelectedRolesChanged.next(this.selectedRoles);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedRoles.length > 0) {
            this.deselectRoles();
        }
        else {
            this.selectRoles();
        }
    }

    /**
     * Select roles
     *
     * @param filterParameter
     * @param filterValue
     */
    selectRoles(filterParameter?, filterValue?): void {
        this.selectedRoles = [];

        // If there is no filter, select all roles
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedRoles = [];
            this.roles.map(role => {
                this.selectedRoles.push(role.RoleID);
            });
        }

        // Trigger the next event
        this.onSelectedRolesChanged.next(this.selectedRoles);
    }

    /**
     * Update role
     *
     * @param role
     * @returns {Promise<any>}
     */
    updateRole(role): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/roles-roles/' + role.id, { ...role })
                .subscribe(response => {
                    this.getRoles();
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
    updateUserData(userData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/roles-user/' + this.user.id, { ...userData })
                .subscribe(response => {
                    // this.getUserData();
                    this.getRoles();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect roles
     */
    deselectRoles(): void {
        this.selectedRoles = [];

        // Trigger the next event
        this.onSelectedRolesChanged.next(this.selectedRoles);
    }

    /**
     * Delete role
     *
     * @param role
     */
    deleteRole1(role): void {
        const roleIndex = this.roles.indexOf(role);
        this.roles.splice(roleIndex, 1);
        this.onRolesChanged.next(this.roles);
    }
    /**
       * Delete distributor
       *
       * @param roles
       *  @returns {Promise<any>}
       */
    deleteRole(roles): Promise<any> {
        //  console.log(roles);
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure', roles)
                .subscribe(response => {
                    //  console.log(response);               
                    this.getRoles();
                    resolve(response);
                });
        });
    }
    /**
     * Delete selected roles
     */
    deleteSelectedRoles(): void {
        for (const roleId of this.selectedRoles) {
            const role = this.roles.find(_role => {
                return _role.RoleID === roleId;
            });
            const roleIndex = this.roles.indexOf(role);
            this.deleteMultipleRecord(role);
        }
        this.onRolesChanged.next(this.roles);
        this.deselectRoles();
        this.getRoles();
    }
    deleteMultipleRecord(role): void {
        const DeleteRoleInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "RoleID": role.RoleID };

        DeleteRoleInputData.push(myInput);
        const input = {
            "MethodName": "DeleteRole",
            "InputStr": DeleteRoleInputData
        }
        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure', input)
            .subscribe(response => {

            });
    }
    updateRoles(roles, treeviewselected): Promise<any> {
        return new Promise((resolve, reject) => {

            const UserInputData = [];
            roles.Device = "D";
            roles.UserID = sessionStorage.getItem('UserID');
            roles.SelectedModule = treeviewselected;

            UserInputData.push(roles);


            const Roleinput = {
                "MethodName": "SaveRole",
                "InputStr": UserInputData
            }


            console.log(JSON.stringify(Roleinput));
            this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure', Roleinput)
                .subscribe((response: any) => {
                    console.log(response);
                    var myObjStr1 = response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    var jsonobj1 = JSON.parse(myObjStr1);

                    if (jsonobj1.Result[0]["ErrorID"] > 0) {
                        var jsonStr2 = "";

                        alert(jsonobj1.Result[0]["ErrorMessage"]);

                        this.getRoles();
                    }
                    resolve(response);
                });
        });
    }

}
