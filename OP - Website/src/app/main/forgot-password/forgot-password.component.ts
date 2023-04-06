import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    UserInputData=[];
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder,
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient
    )
    {
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
        this.forgotPasswordForm = this._formBuilder.group({
            UserName: ['', [Validators.required]]
        });
    }
    ResetPassword(): Promise<any>
    {   
        const UserDetails = this.forgotPasswordForm.getRawValue();      
        UserDetails.Device="D";
        this.UserInputData.push(UserDetails);
         const Resetinput={
            "MethodName" : "ResetPassword",
            "InputStr" :  this.UserInputData
            } 
            console.log(JSON.stringify(Resetinput));

        
            
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/op/ResetPassword',Resetinput)
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
                        //  console.log(JSON.stringify(jsonobj2));
                     console.log(jsonobj2.Result[0].ErrorMessage);
                       //  alert(jsonobj1.Result[0]["ErrorMessage"]+" : "+jsonobj2.Result[0].NewPassword);
                        }
                        else
                        {                           
                            alert(jsonobj1.Result[0]["ErrorMessage"]); 
                        }
            }, reject);
        });
    }
}
