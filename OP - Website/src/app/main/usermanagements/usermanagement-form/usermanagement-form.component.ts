import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { Usermanagement } from 'app/main/usermanagements/usermanagement.model';
import { HttpClient } from '@angular/common/http';
import { UsermanagementsService } from '../usermanagements.service';

@Component({
  selector: 'usermanagements-usermanagement-form-dialog',
  templateUrl: './usermanagement-form.component.html',
  styleUrls: ['./usermanagement-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UsermanagementsUsermanagementFormDialogComponent {
  action: string;
  usermanagement: Usermanagement;
  usermanagementForm: FormGroup;
  dialogTitle: string;
  StateListItems: any;
  RegionListItems: any;
  RoleListItems: any;
  CountryListItems: any;
  DistributorListItems: any = [];
  TaskListItems: any = [];
  FieldDistributor: boolean = false;
  FieldRepresentative: boolean = false;
  FieldRoleStatus: boolean = false;
  FieldContact: boolean = false;
  companyhide: boolean = false;
  ShowContact: boolean = false;
  ContactValue: any;
  DepartmentListItems: any;
  TeamListItems: any;
  ImageURLNew: any = [];
  TimeZoneListItems: any;
  selectedStateList: any;
  /**
   * Constructor
   *
   * @param {MatDialogRef<UsermanagementsUsermanagementFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   *  @param {MatDialog} _matDialog
   */
  constructor(
    public matDialogRef: MatDialogRef<UsermanagementsUsermanagementFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    private _usermanagementsService: UsermanagementsService,
    public _matDialog: MatDialog
  ) {
    const CountryInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    CountryInputData.push(myInput);
    const Countryinput = {
      "MethodName": "GetCountry",
      "InputStr": CountryInputData
    }

    this._usermanagementsService.getData(Countryinput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        //console.log(jsonobj2);
        this.CountryListItems = jsonobj2.Result;
      }
    });

    const TimezoneInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    TimezoneInputData.push(myInput);
    const Timezoneinput = {
      "MethodName": "GetTimezone",
      "InputStr": TimezoneInputData
    }

    this._usermanagementsService.getData(Timezoneinput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        //console.log(jsonobj2);
        this.TimeZoneListItems = jsonobj2.Result;
      }
    });

    const RoleInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    RoleInputData.push(myInput);
    const Roleinput = {
      "MethodName": "GetRole",
      "InputStr": RoleInputData
    }

    this._usermanagementsService.getData(Roleinput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        //console.log(jsonobj2);
        this.RoleListItems = jsonobj2.Result;
      }
    });
    const RegionInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    RegionInputData.push(myInput);
    const Regioninput = {
      "MethodName": "GetRegion",
      "InputStr": RegionInputData
    }

    this._usermanagementsService.getData(Regioninput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        //console.log(jsonobj2);
        this.RegionListItems = jsonobj2.Result;
      }
    });

    const DistributorInputData = [];
    var myDistInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "RegionFilterIDs": [-1] };
    DistributorInputData.push(myDistInput);
    const DistributorInput = {
      "MethodName": "GetDistributor",
      "InputStr": DistributorInputData
    }

    this._usermanagementsService.getData(DistributorInput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        console.log(jsonobj2.Result)
        this.DistributorListItems = jsonobj2.Result;
      }
      else {
        this.DistributorListItems = [];
      }
    });

    this.loadDepartment();

    this.action = _data.action;
    //alert(this.action);
    console.log(this.action);
    if (this.action == 'edit') {
      console.log(this.action);
      console.log(_data.usermanagement);
      this.dialogTitle = 'Edit User Management';
      this.usermanagement = _data.usermanagement;
      console.log(_data.usermanagement.CountryID);
      console.log(this.usermanagement.CountryID);
      this.usermanagement.EditUserID = _data.usermanagement.UserID;
      this.usermanagement.TimeZoneID = _data.usermanagement.TimeZoneID;
      if (this.usermanagement.CountryID == undefined) {
        this.usermanagement.CountryID = "1";
      }
      this.selectedStateList = [];
     
      this.usermanagement.DistributorID = _data.usermanagement.ParentID;

      this.FieldRoleStatus = _data.usermanagement.Contact;
      this.onEditcontrolLoad(this.usermanagement.RoleID);
      this.onEdiContactLoad(this.usermanagement.Contact);
      var RoleIDstr = this.usermanagement.RoleID;

    }
    else {
      this.dialogTitle = 'New User Management';
      this.usermanagement = new Usermanagement({});
      this.usermanagement.EditUserID = null;
    }
    if (this.action === 'edit') {
      if ((this.usermanagement.CountryID != "") && (this.usermanagement.CountryID != undefined)) {
        this.loadState(this.usermanagement.CountryID);
      }
      else {
        this.loadState("1");
      }

    }
    else {
      this.loadState("1");
    }

    this.usermanagementForm = this.createUsermanagementForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create usermanagement form
   *
   * @returns {FormGroup}
   */
  createUsermanagementForm(): FormGroup {
    console.log(this.usermanagement)
    return this._formBuilder.group({
      EditUserID: [this.usermanagement.EditUserID],
      RoleID: [this.usermanagement.RoleID],
      FirstName: [this.usermanagement.FirstName],
      LastName: [this.usermanagement.LastName],
      RoleName: [this.usermanagement.RoleName],
      EMailID: [this.usermanagement.EMailID],
      UserName: [this.usermanagement.UserName],
      MobileNo: [this.usermanagement.MobileNo],
      CountryID: [this.usermanagement.CountryID],
      StateID: [this.usermanagement.StateID],
      Address: [this.usermanagement.Address],
      City: [this.usermanagement.City],
      Zipcode: [this.usermanagement.Zipcode],
      RequestDate: [this.usermanagement.RequestDate],
      ApprovalDate: [this.usermanagement.ApprovalDate],
      RegionID: [this.usermanagement.RegionID],
      RegionName: [this.usermanagement.RegionName],
      CompanyName: [this.usermanagement.CompanyName],
      DistributorID: [this.usermanagement.DistributorID],
      Contact: [this.usermanagement.Contact],
      JobTitle: [this.usermanagement.JobTitle],
      DepartmentID: [this.usermanagement.DepartmentID],
      TeamID: [this.usermanagement.TeamID],
      ProfileURL: [this.usermanagement.ProfileURL],
      TimeZoneID: [this.usermanagement.TimeZoneID],
      StateListIDs: [this.usermanagement.StateListIDs]
    });
  }
  selectedFile: File

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
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
    var EventidStr = ""


    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('Module', 'User');
    uploadData.append('ID', this.usermanagement.EditUserID);
    uploadData.append('SaveFolder', 'User');
    this._http.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
      reportProgress: true,
      observe: 'events'

    })
      .subscribe(event => {
        console.log(event); // handle event here
      });


  }


  onContactChange(event: any) {
    if (event === true) {
      this.FieldContact = true;
    }
    else {
      this.FieldContact = false;
      this.usermanagementForm.get('JobTitle').clearValidators();
      this.usermanagementForm.get('DepartmentID').clearValidators();
      this.usermanagementForm.get('TeamID').clearValidators();
      this.usermanagementForm.get('JobTitle').updateValueAndValidity();
      this.usermanagementForm.get('DepartmentID').updateValueAndValidity();
      this.usermanagementForm.get('TeamID').updateValueAndValidity();
      this.usermanagementForm.get('JobTitle').setErrors(null);
      this.usermanagementForm.get('DepartmentID').setErrors(null);
      this.usermanagementForm.get('TeamID').setErrors(null);
      this.usermanagementForm.get('JobTitle').reset();
      this.usermanagementForm.get('DepartmentID').reset();
      this.usermanagementForm.get('TeamID').reset();
    }
  }
  saveUser() {
    this._usermanagementsService.updateUser(this.usermanagementForm.value, this.selectedFile);
    this._matDialog.closeAll();
  }
  onCountryChange(event) {
    this.loadState(event.value);
  }

  loadState(CountryID) {
    const StateInputData = [];
    var StateInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "CountryID": CountryID };
    StateInputData.push(StateInput);
    const Stateinput = {
      "MethodName": "GetState",
      "InputStr": StateInputData
    }
    console.log(JSON.stringify(Stateinput));
    this._usermanagementsService.getData(Stateinput).then((data) => {
      // //console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        ////console.log(jsonobj2);
        this.StateListItems = jsonobj2.Result;
      }
    });
  }
  onRoleChange(event: any) {
    console.log(event.value)
    event.RoleID = event.value;
    this.FieldDistributor = false;
    this.FieldRepresentative = false;
    this.usermanagementForm.get('Contact').patchValue(false);

    this.usermanagementForm.get('CompanyName').clearValidators();
    this.usermanagementForm.get('DistributorID').clearValidators();
    this.usermanagementForm.get('JobTitle').clearValidators();
    this.usermanagementForm.get('DepartmentID').clearValidators();
    this.usermanagementForm.get('TeamID').clearValidators();

    this.usermanagementForm.get('CompanyName').updateValueAndValidity();
    this.usermanagementForm.get('DistributorID').updateValueAndValidity();
    this.usermanagementForm.get('JobTitle').updateValueAndValidity();
    this.usermanagementForm.get('DepartmentID').updateValueAndValidity();
    this.usermanagementForm.get('TeamID').updateValueAndValidity();

    this.usermanagementForm.get('CompanyName').setErrors(null);
    this.usermanagementForm.get('DistributorID').setErrors(null);
    this.usermanagementForm.get('JobTitle').setErrors(null);
    this.usermanagementForm.get('DepartmentID').setErrors(null);
    this.usermanagementForm.get('TeamID').setErrors(null);

    this.usermanagementForm.get('CompanyName').reset();
    this.usermanagementForm.get('DistributorID').reset();
    this.usermanagementForm.get('JobTitle').reset();
    this.usermanagementForm.get('DepartmentID').reset();
    this.usermanagementForm.get('TeamID').reset();

    if (event.RoleID == 2) {
      this.FieldDistributor = true;
    }
    else if (event.RoleID == 3) {
      this.FieldRepresentative = true;
    }
    else if ((event.RoleID == 1) || (event.RoleID == 3) || (event.RoleID == 5) || (event.RoleID == 6) || (event.RoleID == 7)) {
      this.FieldDistributor = false;
    }
    if ((event.RoleID == 1) || (event.RoleID == 5) || (event.RoleID == 6) || (event.RoleID == 7)) {
      this.ShowContact = true;
    }
    else {
      this.ShowContact = false;
    }
    this.onContactChange(false);
  }

  onEditcontrolLoad(RoleID) {

    this.FieldDistributor = false;
    this.FieldRepresentative = false;

    if (RoleID == 2) {
      this.FieldDistributor = true;
    }
    else if (RoleID == 3) {
      this.FieldRepresentative = true;
      this.loadRepTask();

    }
    // else if(RoleID ==1)
    // {
    //   this.FieldDistributor=true;
    // }  
    else if ((RoleID == 1) || (RoleID == 3) || (RoleID == 5) || (RoleID == 6) || (RoleID == 7)) {
      this.FieldDistributor = false;
    }
    if ((RoleID == 1) || (RoleID == 5) || (RoleID == 6) || (RoleID == 7)) {
      this.ShowContact = true;
    }
    else {
      this.ShowContact = false;
    }
    if ((this.usermanagement.DepartmentID != "0") && (this.usermanagement.DepartmentID != undefined)) {
      this.onDepartmentChange(this.usermanagement.DepartmentID);
    }

  }
  onEdiContactLoad(RoleID) {
    if ((RoleID == 1) || (RoleID == 3) || (RoleID == 5) || (RoleID == 6) || (RoleID == 7)) {
      this.FieldContact = true;

    }
    else {
      this.FieldContact = false;
    }
  }
  loadDepartment() {
    const DepartmentInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    DepartmentInputData.push(myInput);
    const Departmentinput = {
      "MethodName": "GetDepartment",
      "InputStr": DepartmentInputData
    }
    this._usermanagementsService.getData(Departmentinput).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        this.DepartmentListItems = jsonobj2.Result;
      }
    });

  }
  onDepartmentChange(event) {
    const TeamInputData = [];
    var Input = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "DepartmentID": event };
    TeamInputData.push(Input);
    const Teaminput = {
      "MethodName": "GetTeam",
      "InputStr": TeamInputData
    }
    console.log(JSON.stringify(Teaminput));
    this._usermanagementsService.getData(Teaminput).then((data) => {
      console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        this.TeamListItems = jsonobj2.Result;
      }
    });
  }

  loadRepTask() {
    const TaskInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "EditUserID": this.usermanagement.EditUserID };
    TaskInputData.push(myInput);
    const Taskinput = {
      "MethodName": "GetUserOnBoardingTask",
      "InputStr": TaskInputData
    }
    //console.log(JSON.stringify(Taskinput));
    this._usermanagementsService.getData(Taskinput).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        this.TaskListItems = jsonobj2.Result;
        console.log(this.TaskListItems);
        //  this.dataSource=this.TaskListItems;

      }
    });

  }


}