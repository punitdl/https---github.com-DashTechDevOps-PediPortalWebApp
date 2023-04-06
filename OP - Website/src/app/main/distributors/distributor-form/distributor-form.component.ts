import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Distributor } from 'app/main/distributors/distributor.model';
import { HttpClient } from '@angular/common/http';
import { DistributorsService } from '../distributors.service';


@Component({
  selector: 'distributors-distributor-form-dialog',
  templateUrl: './distributor-form.component.html',
  styleUrls: ['./distributor-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DistributorsDistributorFormDialogComponent {
  action: string;
  distributor: Distributor;
  distributorForm: FormGroup;
  dialogTitle: string;
  StateListItems: any;
  Region: [];
  RegionListItems: any;
  selectedStateList: any;
  /**
   * Constructor
   *
   * @param {MatDialogRef<DistributorsDistributorFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder,
   * @param {DistributorsService} _distributorsService
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
    public matDialogRef: MatDialogRef<DistributorsDistributorFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    private _distributorsService: DistributorsService,
  ) {
    // Set the defaults

    const RegionInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    RegionInputData.push(myInput);
    const Regioninput = {
      "MethodName": "GetRegion",
      "InputStr": RegionInputData
    }

    this._distributorsService.getData(Regioninput).then((data) => {
      console.log(data);
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

    const StateInputData = [];
    var StateInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "CountryID": "1" };
    StateInputData.push(StateInput);
    const Stateinput = {
      "MethodName": "GetState",
      "InputStr": StateInputData
    }

    this._distributorsService.getData(Stateinput).then((data) => {
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
        this.StateListItems = jsonobj2.Result;
      }
    });
    // _http.get<any[]>('api/common-statelist').subscribe(result => {
    //     this.StateListItems = result;
    //     console.log(this.StateListItems);
    //   }, error => console.error(error)); 

    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Distributor';
      this.distributor = _data.distributor;

      this.selectedStateList = [];
      console.log(_data.distributor.StateListIDs);
      console.log(typeof (_data.distributor.StateListIDs));
      if (typeof (_data.distributor.StateListIDs) == 'string') {
        if (_data.distributor.StateListIDs != undefined) {
          this.selectedStateList = _data.distributor.StateListIDs.substring(1, this.distributor.StateListIDs.length - 1).split(',').map(function (item) {
            return parseInt(item, 10);
          });
        }
      }
      else {
        this.selectedStateList = _data.distributor.StateListIDs;
      }

      this.distributor.StateListIDs = this.selectedStateList;

    }
    else {
      this.dialogTitle = 'New Distributor';
      this.distributor = new Distributor({});
    }

    this.distributorForm = this.createDistributorForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create distributor form
   *
   * @returns {FormGroup}
   */
  createDistributorForm(): FormGroup {
    return this._formBuilder.group({
      DistributorID: [this.distributor.DistributorID],
      RegionID: [this.distributor.RegionID],
      Region: [this.distributor.Region],
      FirstName: [this.distributor.FirstName],
      LastName: [this.distributor.LastName],
      CompanyName: [this.distributor.CompanyName],
      EMailID: [this.distributor.EMailID],
      PhoneNo: [this.distributor.PhoneNo],
      MobileNo: [this.distributor.MobileNo],
      StateID: [this.distributor.StateID],
      StateDescription: [this.distributor.StateDescription],
      City: [this.distributor.City],
      PhotoURL: [this.distributor.PhotoURL],
      Address: [this.distributor.Address],
      Zipcode: [this.distributor.Zipcode],
      StateListIDs: [this.distributor.StateListIDs]
    });
  }
}
