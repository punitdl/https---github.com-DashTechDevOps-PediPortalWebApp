import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';

@Component({
    selector     : 'profile',
    templateUrl  : './profile.component.html',
    styleUrls    : ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileComponent implements OnInit
{
    profile: Profile;
    profileForm: FormGroup;
    confirmDialogRef: any;
    ProfileInputData=[];
    ProfileData: any = [];
    FirstName:string;
    LastName:string;
    EMailID:string;
    MobileNo:string;
    ProfileURL:string;
    private _matDialog: any;
  
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private _profileService: ProfileService,
    )
    {
          //this.mymodel=[];
   
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
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
    ngOnInit(): void
    {
        //console.log(JSON.stringify(this.ProfileData));
       
        this.profileForm = this._formBuilder.group({
                EMailID: ['', [Validators.required, Validators.email]],
             FirstName:['', [Validators.required]],
             LastName:['', [Validators.required]],
             MobileNo:['', [Validators.required]],
        });
       this.loadProfile();      
       this.ProfileURL=sessionStorage.getItem('ProfileURL');
    }

    // updateprofile(): Promise<any>
    // {
      
    //         console.log(JSON.stringify(Profileinput));
    //     return new Promise((resolve, reject) => {
    //        this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Profileinput)
    //        .subscribe((response: any) => {
    //         var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
    //         var jsonobj1 = JSON.parse(myObjStr1);
    //         if (jsonobj1.Result[0]["ErrorID"] > 0)
    //         {
    //           var jsonStr2 ="";          

    //         alert(jsonobj1.Result[0]["ErrorMessage"]);
           
    //         }
           
    //                 resolve(response); 
    //                  console.log(response);
    //             }, reject);
                
    //     });
   
    // }
   

  loadProfile()
  {

    const UserInputData=[];
    var myInput = { "UserID":sessionStorage.getItem('UserID'), "Device":"D"};
    UserInputData.push(myInput);
    const Userinput={
        "MethodName" : "GetUserProfile",
        "InputStr" :  UserInputData
        }             
        
        this._profileService.GetUserProfile(Userinput).then((data) => {           
            var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0)
            {
              var jsonStr2 ="";             
              for (let i = 0; i < data["Table1"].length; i++) {
                jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
              }
              var jsonobj2 = JSON.parse(jsonStr2);             
              this.ProfileData=jsonobj2.Result[0];   

            
            
             
              this.FirstName=    this.ProfileData.FirstName;
              this.LastName=this.ProfileData.LastName;
              this.EMailID=this.ProfileData.EMailID;
              this.MobileNo=this.ProfileData.MobileNo;
            
        }
        else
        {
            this.ProfileData = [];
            alert(jsonobj1.Result[0]["ErrorMessage"]); 
        }
      
        }); 
      
        
  }

  updateprofile()
  {   
    const UserDetails = this.profileForm.getRawValue();
    UserDetails.UserID=sessionStorage.getItem('UserID');
    UserDetails.Device="D";
    this.ProfileInputData.push(UserDetails);
     const Profileinput={
        "MethodName" : "SaveUserProfile",
        "InputStr" :  this.ProfileInputData
        }        
    this._profileService.updateprofile(Profileinput).then((data) => {
        var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        var jsonobj1 = JSON.parse(myObjStr1);
       
        if (jsonobj1.Result[0]["ErrorID"] > 0)
        {
            alert(jsonobj1.Result[0]["ErrorMessage"]);         
    }
    else{
    alert(jsonobj1.Result[0]["ErrorMessage"]);
    }
    this.loadProfile();
    }); 
    
    }
    
  }

