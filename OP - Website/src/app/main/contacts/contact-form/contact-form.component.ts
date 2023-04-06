import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Contact } from 'app/main/contacts/contact.model';
import { HttpClient } from '@angular/common/http';
import { ContactsService } from '../contacts.service';
@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent
{
    action: string;
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;
    ContactsListItems: any;
    DepartmentListItems: any;
    ContactsFilter: string = "-1";
    TeamListItems: any;
    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder,
     *  @param {ContactsService} _contactsService
     * 
     */
    selectedFile: File
  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }
    onUpload() {
        // upload code goes here
        const uploadData = new FormData();
        uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
        uploadData.append('Module', 'Profile');
        uploadData.append('ID', 'cric');
        uploadData.append('Extension', 'png');
    
        //this._http.post('http://192.168.29.201/RLAPI/api/Cricket/ImageUpload', uploadData, {
        this._http.post('http://api.cricstory.in//Api/Cricket/ImageUpload', uploadData, {
          reportProgress: true,
          observe: 'events'
    
        })
          .subscribe(event => {
            console.log(event); // handle event here
          });
      }
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _contactsService: ContactsService,
    )
    {
        // Set the defaults
        
        _http.get<any[]>('api/contacts-contactslist').subscribe(result => {
            this.ContactsListItems = result;
            // console.log(this.ContactsListItems);
          }, error => console.error(error));

          const DepartmentInputData=[];
          var myInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D"};
          DepartmentInputData.push(myInput);
          const Departmentinput={
              "MethodName" : "GetDepartment",
              "InputStr" :  DepartmentInputData
              }    
              this._contactsService.getData(Departmentinput).then((data) => {
                var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0)
                {
                  var jsonStr2 ="";                 
                  for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
                  }
                  var jsonobj2 = JSON.parse(jsonStr2);               
                  this.DepartmentListItems=jsonobj2.Result;
            }
            }); 
          //   const TeamInputData=[];
          // var Input = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","DepartmentID":-1};
          // TeamInputData.push(Input);
          // const Teaminput={
          //     "MethodName" : "GetTeam",
          //     "InputStr" :  TeamInputData
          //     }    
          //     console.log(this.contact.DepartmentID);
          //     this._contactsService.getData(Teaminput).then((data) => {
          //       var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
          //       var jsonobj1 = JSON.parse(myObjStr1);
          //       if (jsonobj1.Result[0]["ErrorID"] > 0)
          //       {
          //         var jsonStr2 ="";                 
          //         for (let i = 0; i < data["Table1"].length; i++) {
          //           jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
          //         }
          //         var jsonobj2 = JSON.parse(jsonStr2);               
          //         this.TeamListItems=jsonobj2.Result;
          //   }
          //   }); 
          // _http.get<any[]>('api/common-teamlist').subscribe(result => {
          //   this.TeamListItems = result;
          //   console.log(this.TeamListItems);
          // }, error => console.error(error)); 
          
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Contact';
            this.contact = _data.contact;
        }
        else
        {
            this.dialogTitle = 'New Contact';
            this.contact = new Contact({});
        }

        this.contactForm = this.createContactForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup
    {
        return this._formBuilder.group({
          ContactID      : [this.contact.ContactID],
          FirstName    : [this.contact.FirstName],
          LastName: [this.contact.LastName],
          JobTitle:[this.contact.JobTitle],
          DepartmentID :[this.contact.DepartmentID],
          DepartmentName: [this.contact.DepartmentName],
          TeamID: [this.contact.TeamID],
          TeamName: [this.contact.TeamName],
          EMailID: [this.contact.EMailID],
          PhoneNo: [this.contact.PhoneNo],
          MobileNo: [this.contact.MobileNo],
          PhotoURL: [this.contact.PhotoURL]
        });
    }
}
