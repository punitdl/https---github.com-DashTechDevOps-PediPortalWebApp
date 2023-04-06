import { Component, Inject, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { Dailymessage } from 'app/main/dailymessages/dailymessage.model';
import { DailymessagesService } from '../dailymessages.service';
import { HttpClient } from '@angular/common/http';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'dailymessages-dailymessage-form-dialog',
  templateUrl: './dailymessage-form.component.html',
  styleUrls: ['./dailymessage-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DailymessagesDailymessageFormDialogComponent implements OnDestroy {
  @ViewChild('allSelected') private allSelected: MatOption;
  action: string;
  dailymessage: Dailymessage;
  dailymessageForm: FormGroup;
  dialogTitle: string;
  CategoryListItems: any;
  toppings = new FormControl();
  mymodel: Array<number>;
  roleList: any = [];
  roleListLength: any = 0;
  selectedFile: File;
  rolearray: [];
  selectedrolesStr: string;
  selectedroles: any = [];
  ImageURLNew: any = [];
  ImageURL: string = "";

  ngOnDestroy(): void {
    this.selectedFile = null;
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.ImageURLNew = event.target.result;

      }
    }
  }

  onUpload() {
    // upload code goes here
    const uploadData = new FormData();
    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('Module', 'DailyMessage');
    uploadData.append('ID', this.dailymessage.MessageID);
    uploadData.append('SaveFolder', 'DailyMessage');
    this._http.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
      reportProgress: true,
      observe: 'events'

    })
      .subscribe(event => {
        console.log(event); // handle event here
      });
  }




  /**
   * Constructor
   *
   * @param {MatDialogRef<DailymessagesDailymessageFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder,
   *  @param {MatDialog} _matDialog
   */
  constructor(
    public matDialogRef: MatDialogRef<DailymessagesDailymessageFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _dailymessagesService: DailymessagesService,
    private _http: HttpClient,
    public _matDialog: MatDialog
  ) {
    //this.mymodel=[];
    const UserInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), Device: "D" };
    UserInputData.push(myInput);
    const Userinput = {
      "MethodName": "GetRole",
      "InputStr": UserInputData
    }

    this._dailymessagesService.getRole(Userinput).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        this.roleList = jsonobj2.Result;
        this.roleListLength = this.roleList.length;
        console.log(this.roleListLength);
        console.log(_data.dailymessage?.Roles.length);
        if (this.roleListLength == _data.dailymessage?.Roles.length)
        {
          this.dailymessageForm.controls.Roles
          .patchValue([0, ...this.roleList.map(item => item.RoleID)]);
        }
      }
      else {
        this.roleList = [];
        this.roleListLength = this.roleList.length;
        alert(jsonobj1.Result[0]["ErrorMessage"]);
      }
    });

    this.action = _data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Daily Message';
      this.selectedroles = [];
      this.selectedrolesStr = "";
      
      console.log(_data);
      // console.log(_data.dailymessage.Roles);
      this.selectedrolesStr = _data.dailymessage?.Roles ? _data.dailymessage?.Roles.toString() : "";
      if (this.selectedrolesStr != undefined || this.selectedrolesStr == "") {
        this.selectedroles = this.selectedrolesStr.split(',').map(f=>Number(f));
      }
      _data.dailymessage.Roles = this.selectedroles;
      
      // if (_data.dailymessage.Roles != undefined)
      // {

      //   console.log(_data.dailymessage.Roles);
      //   this.selectedroles =  this.selectedrolesStr.split(',').map(function(item) {

      //     return parseInt(item, 10);
      //   });
      // }
      // console.log( this.selectedroles);
      //_data.dailymessage.Roles = this.selectedroles;
      this.dailymessage = _data.dailymessage;
    }
    else {

      this.dialogTitle = 'New Daily Message';
      this.dailymessage = new Dailymessage({});
      this.dailymessage.MessageID = null;

    }
    this.dailymessageForm = this.createDailymessageForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create dailymessage form
   * 
   * 'followupmessage' : 'The more you know!',
          'url': 'https://animalplanet.com',
          'image'   : '',
          
   *
   * @returns {FormGroup}
   */
  createDailymessageForm(): FormGroup {
    return this._formBuilder.group({
      MessageID: [this.dailymessage.MessageID],
      FromDate: [this.dailymessage.FromDate],
      ToDate: [this.dailymessage.ToDate],
      Message: [this.dailymessage.Message],
      FollowupMessage: [this.dailymessage.FollowupMessage],
      LinkURL: [this.dailymessage.LinkURL],
      ImageURL: [this.dailymessage.ImageURL],
      // Roles: [this.dailymessage.Roles]
      Roles: [this.dailymessage.Roles][0].length != 0 ? [this.dailymessage.Roles] : []
      //Roles: this.dailymessage.Roles.length != 0 ? this.dailymessage.Roles : [-1]
      //Roles: [-1]
    });

  }
  saveDailyMessage() {
    if (this.dailymessageForm.get("MessageID").value == null) {
      this.dailymessageForm.get("ImageURL").patchValue("");
    }
    this._dailymessagesService.UpdateDailyMessage1(this.dailymessageForm.value, this.selectedFile);
    this._matDialog.closeAll();
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.dailymessageForm.controls.Roles
        .patchValue([0, ...this.roleList.map(item => item.RoleID)]);
    } else {
      this.dailymessageForm.controls.Roles.patchValue([]);
    }
  }

  tosslePerOne(all) {
    console.log(all);
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.dailymessageForm.controls.Roles.value.length == this.roleList.length)
      this.allSelected.select();

  }
}
