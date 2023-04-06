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
export class LoginService implements Resolve<any>
{
  onContactsChanged: BehaviorSubject<any>;
  onSelectedContactsChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  onstateid: BehaviorSubject<any>;

  user: any;
  selectedContacts: string[] = [];

  searchText: string;
  filterBy: string;
  onProductChanged: BehaviorSubject<any>;

  public authenticated: boolean;
  public usernew: User;
  public UserDisplayName: String = "";

  InputData = {
    'Device': 'M',
    'UserName': '',
    'AzureADID': '',
    'OS': "Windows 10",
    'Browser': "Chrome",
    'Version': "30.00"
  };

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private msalService: MsalService,
    private apiClient : ApiHttpService
  ) {
    // Set the defaults
    this.onContactsChanged = new BehaviorSubject([]);
    this.onSelectedContactsChanged = new BehaviorSubject([]);
    this.onUserDataChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();


    this.onstateid = new BehaviorSubject({});
    console.log(this.msalService.getAccount());
    this.authenticated = this.msalService.getAccount() != null;
    // this.getUser().then((user) => { this.user = user; console.log(this.user) });

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
    return new Promise((resolve, reject) => {
      Promise.all([

        // this.getUserData()
      ]).then(
        () => {
          resolve(() => {
          });
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



  CommonInvokeData(UserDetails): Promise<any> {
    return new Promise((resolve, reject) => {
     this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure', UserDetails)
        .subscribe((UserDetailsdata) => {
          resolve(UserDetailsdata);
        }, reject);
    });
  }
  InvokeProcedureSQLLogin(UserDetails): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiClient.post('api/account/login', UserDetails).subscribe((UserDetailsdata) => {
        resolve(UserDetailsdata);
      }, reject);
    });
  }

  GetMenusByRole(RoleId): Promise<any>{
    return new Promise((resolve, reject) => {
      this.apiClient.get('api/module/MenusByRole?roleId='+RoleId).subscribe((menuItems) => {
        resolve(menuItems);
      }, reject);
     
    });
  }

  GetBrands(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.apiClient.get('api/brand/getbrands').subscribe((brands) => {
        resolve(brands);
      }, reject);
     
    });
  }


  logout() {
    this.msalService.logout();
    this.user = null;
    this.authenticated = false;
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<{}> {
    let result = await this.msalService.loginPopup(OAuthSettings)
      .catch((reason) => {
        //this.alertsService.addError('Login failed', JSON.stringify(reason, null, 2));
        alert('Login failed' + JSON.stringify(reason, null, 2));
        console.log(JSON.stringify(reason, null, 2))
      });
    console.log(result);
    if (result) {
      console.log(result)

      this.authenticated = true;
      this.user = await this.getUser();
      // const obj = { 'uniqueId': result.uniqueId, 'user': this.user }
      console.log('success');
      return this.user;

    }
  }

  // Sign out
  signOut(): void {
    this.msalService.logout();
    this.user = null;
    this.authenticated = false;
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    let result = await this.msalService.acquireTokenSilent(OAuthSettings)
      .catch((reason) => {
        //this.alertsService.addError('Get token failed', JSON.stringify(reason, null, 2));
        console.log(JSON.stringify(reason, null, 2))
        alert('Get token failed' + JSON.stringify(reason, null, 2));
      });
    console.log(result)
    if (result) {
      return result.accessToken;
    }

    // Couldn't get a token
    this.authenticated = false;
    return null;
  }

  // <getUserSnippet>
  async getUser(): Promise<any> {
    if (!this.authenticated) return null;

    let graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the
      // auth service
      authProvider: async (done) => {
        let token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });

        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });

    // Get the user from Graph (GET /me)
    let graphUser: MicrosoftGraph.User = await graphClient
      .api('/me')
      .get();
    console.log(graphUser);
    //alert(graphUser.id);
    console.log(graphUser.displayName);
    this.UserDisplayName = graphUser.displayName;
    return graphUser;
  }

}



export class User {

  email?: string;
  avatar: string;
  timeZone: string;
  displayName?: string;
  givenName: string;
  id: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}