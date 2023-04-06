import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ResetPasswordService } from './reset-password.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector     : 'reset-password',
    templateUrl  : './reset-password.component.html',
    styleUrls    : ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{
    resetPasswordForm: FormGroup;
    UserInputData=[];
    // Private
    private _unsubscribeAll: Subject<any>;
 /**
     * Constructor
     *
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.resetPasswordForm = this._formBuilder.group({          
            // email          : ['', [Validators.required, Validators.email]],
            OldPassword: ['', Validators.required],
            Password       : ['', Validators.required],
            NewPassword: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('Password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('NewPassword').updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    // ResetPassword(): void {        
    //     const UserDetails = this.resetPasswordForm.getRawValue();
    //     console.log(UserDetails);
    //     this.ResetPassword(UserDetails);
    // }
    ResetPassword(): Promise<any>
    {   
        const UserDetails = this.resetPasswordForm.getRawValue();
        UserDetails.UserID=sessionStorage.getItem('UserID');
        UserDetails.Device="D";
        this.UserInputData.push(UserDetails);
         const Resetinput={
            "MethodName" : "ChangePassword",
            "InputStr" :  this.UserInputData
            } 
            console.log(JSON.stringify(Resetinput));
        return new Promise((resolve, reject) => {
           this._httpClient.post('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure',Resetinput)
           .subscribe((response: any) => {
                var myObjStr1= response.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);              
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                var jsonStr2 ="";
                alert(jsonobj1.Result[0]["ErrorMessage"]); 
                }
                }, reject);
        });
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('Password');
    const passwordConfirm = control.parent.get('NewPassword');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};
