import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { navigation } from 'app/navigation/navigation';
import { BroadcastService, MsalService, } from '@azure/msal-angular';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {

  newchildmenu: any;
  navigation: any;
  loginForm: FormGroup;
  UserID: any;
  UserData: any[];
  UserInputData = [];

  AD_Output: any;
  ADAuthentication: boolean = false;
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   * @param {FuseNavigationService} _fuseNavigationService
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _LoginService: LoginService,
    private _fuseNavigationService: FuseNavigationService,
    private broadcastService: BroadcastService,
    private msalService: MsalService,
  ) {
    if (_LoginService.authenticated) {
      _LoginService.getUser().then((user) => {
        this.AD_Output = user;
        this.NewAzureLoginCheck();
      })
    }
    //console.log(_LoginService.user);
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      //UserName   : ['', [Validators.required, Validators.email]],  
      UserName: ['', [Validators.required]],
      Password: ['', Validators.required]
    });

  }

  LoginCheck(): void {
    this.UserInputData = [];
    const UserDetails = this.loginForm.getRawValue();
    this.UserInputData.push(UserDetails);
    UserDetails.Device = "D";
    UserDetails.OS = "Windows 10";
    UserDetails.Browser = "Chrome";
    UserDetails.Version = "30.00";
    UserDetails.rememberme = true;
    UserDetails.AppVersion = "";
    UserDetails.DeviceUUID = null;
    UserDetails.DeviceisVirtual = null;
    UserDetails.Latitude = "38.654";
    UserDetails.Longitude = "90.4332";
    UserDetails.Location = "St. Louis, MO, USA";
    UserDetails.AzureADID = "";
    UserDetails.EmailID = "";
    UserDetails.AzureResponse = "";
    
    var userData = {'Email':UserDetails.UserName,'Password':UserDetails.Password};
    
    this._LoginService.InvokeProcedureSQLLogin(userData).then((data) => {
      
      if(data.meta.status){
        localStorage.setItem('UserID', data.data.userId);
        localStorage.setItem('EMailID', data.data.emailId);
        localStorage.setItem('UserName', data.data.userName);
        localStorage.setItem('ProfileURL', data.data.profileURL);
        localStorage.setItem('RoleID', data.data.roleId);
        localStorage.setItem('AccessToken',data.data.accessToken);
        
        this._LoginService.GetMenusByRole(data.data.roleId).then((menuItems)=>{

          const MenuRights = [];
          const childMenuRights = [];
          var myInput = { "id": 'applications', "title": "Master Control", "type": 'group', "children": menuItems.data };
  
          MenuRights.push(myInput);
          
          this.navigation = MenuRights;
  
          this._fuseNavigationService.register('new1', this.navigation);
  
          // Set the main navigation as our current navigation
          this._fuseNavigationService.setCurrentNavigation('new1');

          if (menuItems.meta.status) {
            
            //this.router.navigate(["." + menuItems.data[0].url]);
            this.router.navigate(["./dashboard"]);
          }
          else {
            alert(data.meta.message);
          }

        });

      }
      else{
       // this.toastr.error(data.meta.message);
      }
    });

  }

  LoadMenu(UserID): void {

    const NavigationInputData = [];
    var myInput = { "UserID": UserID, "Device": "D" };
    NavigationInputData.push(myInput);
    const MenuSourceInput = {
      "MethodName": "GetMenu",
      "InputStr": NavigationInputData
    }
    this._LoginService.CommonInvokeData(MenuSourceInput).then((data) => {

      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        this.newchildmenu = jsonobj2.Result;
        // console.log(this.newchildmenu);
        const MenuRights = [];
        const childMenuRights = [];
        var myInput = { "id": 'applications', "title": "Master Control", "type": 'group', "children": this.newchildmenu };

        MenuRights.push(myInput);
        console.log(myInput);

        //  console.log(JSON.stringify(MenuRights));

        this.navigation = MenuRights;

        this._fuseNavigationService.register('new1', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('new1');

        // console.log(this.navigation);

        if (this.newchildmenu) {
          this.router.navigate(["." + this.newchildmenu[0].url]);
        }
        else {
          alert("You have no desktop access")
        }

      }
      else {

        alert(jsonobj1.Result[0]["ErrorMessage"]);
      }
    });

  }


  logout() {
    this._LoginService.logout();
  }

  async AzureSignIn() {
    this.AD_Output = await this._LoginService.signIn();
    this.NewAzureLoginCheck();
  }

  NewAzureLoginCheck() {
    console.log(this.AD_Output);
    if (this.AD_Output) {
      const UserDetails = this.loginForm.getRawValue();
      this.UserInputData.push(UserDetails);
      UserDetails.Device = "D";
      UserDetails.OS = "Windows 10";
      UserDetails.Browser = "Chrome";
      UserDetails.Version = "30.00";
      UserDetails.UserName = this.AD_Output.userPrincipalName;
      UserDetails.AzureADID = this.AD_Output.id;
      UserDetails.EmailID = this.AD_Output.userPrincipalName;
      const logininput = {
        "MethodName": "LoginAAD",
        "InputStr": this.UserInputData
      }
      console.log(JSON.stringify(logininput));
      this._LoginService.CommonInvokeData(logininput).then((data) => {
        console.log(data);
        var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        var jsonobj1 = JSON.parse(myObjStr1);
        //console.log(jsonobj1);
        if (jsonobj1.Result[0]["ErrorID"] > 0) {
          var jsonStr2 = "";
          // console.log(data["Table1"].length);
          for (let i = 0; i < data["Table1"].length; i++) {
            jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
          }
          var jsonobj2 = JSON.parse(jsonStr2);
          sessionStorage.setItem('UserID', jsonobj2.Result[0]["UserID"]);
          sessionStorage.setItem('EMailID', jsonobj2.Result[0]["EMailID"]);
          sessionStorage.setItem('UserName', jsonobj2.Result[0]["UserName"]);
          sessionStorage.setItem('ProfileURL', jsonobj2.Result[0]["ProfileURL"]);

          this.LoadMenu(jsonobj2.Result[0]["UserID"]);
        }
        else {
          alert(jsonobj1.Result[0]["ErrorMessage"]);
        }
      });
    }
  }


  NewAzureLogoutCheck() {
    this._LoginService.signOut();
  }

}
