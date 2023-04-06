import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';

import { MatColors } from '@fuse/mat-colors';
import { CalendarEventModel } from '../event.model';
import { CalendarService } from '../calendar.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'calendar-event-form-dialog',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CalendarEventFormDialogComponent {
  action: string;
  event: CalendarEvent;
  eventForm: FormGroup;
  dialogTitle: string;
  presetColors = MatColors.presets;
  StateListItems: any;
  CountryListItems: any;
  ImageURLNew: any = [];
  /**
   * Constructor
   *
   * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _calendarService: CalendarService,
    private _http: HttpClient
  ) {
    this.event = _data.event;
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = this.event.title;

      this.onCountryChange(this.event.meta.CountryID);


    }
    else {

      this.dialogTitle = 'New Event';
      this.event = new CalendarEventModel({
        start: _data.date,
        end: _data.date
      });

    }

    this.eventForm = this.createEventForm();

    //  console.log(this.eventForm);
    // const StateInputData=[];
    //       var StateInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D","CountryID": "1"};
    //       StateInputData.push(StateInput);
    //       const Stateinput={
    //           "MethodName" : "GetState",
    //           "InputStr" :  StateInputData
    //           }             

    //           this._calendarService.getData(Stateinput).then((data) => {
    //              // console.log(data);
    //               var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
    //               var jsonobj1 = JSON.parse(myObjStr1);
    //               if (jsonobj1.Result[0]["ErrorID"] > 0)
    //               {
    //                 var jsonStr2 ="";                 
    //                 for (let i = 0; i < data["Table1"].length; i++) {
    //                   jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
    //                 }
    //                 var jsonobj2 = JSON.parse(jsonStr2);
    //                 console.log(jsonobj2);
    //                 this.StateListItems=jsonobj2.Result;
    //           }
    //           }); 
    const CounrtyInputData = [];
    var CountryInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    CounrtyInputData.push(CountryInput);
    const Input = {
      "MethodName": "GetCountry",
      "InputStr": CounrtyInputData
    }

    this._calendarService.getData(Input).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);

        this.CountryListItems = jsonobj2.Result;
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
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

  OnStateLoad() {

  }
  /**
   * Create the event form
   *
   * @returns {FormGroup}
   */
  createEventForm(): FormGroup {
    return new FormGroup({
      title: new FormControl(this.event.title),
      start: new FormControl(this.event.start),
      end: new FormControl(this.event.end),
      //  eventid:new FormControl(this.event.eventid),
      allDay: new FormControl(this.event.allDay),
      // color : this._formBuilder.group({
      //     primary  : new FormControl(this.event.color.primary),
      //     secondary: new FormControl(this.event.color.secondary)
      // }),
      meta:
        this._formBuilder.group({
          location: new FormControl(this.event.meta.location),
          notes: new FormControl(this.event.meta.notes),
          address: new FormControl(this.event.meta.address),
          city: new FormControl(this.event.meta.city),
          CountryID: new FormControl(this.event.meta.CountryID),
          StateID: new FormControl(this.event.meta.StateID),
          zipcode: new FormControl(this.event.meta.zipcode),
          eventImage: new FormControl(this.event.meta.eventImage),
          eventOfficialWebSite: new FormControl(this.event.meta.eventOfficialWebSite),
          registrationLink: new FormControl(this.event.meta.registrationLink),

        })
    });
  }
  saveEvents() {

    var EventID = "";
    if (this._data.event === undefined) {
      EventID = null;
    }
    else {
      EventID = this._data.event.eventid;
    }

    this._calendarService.UpdateEvent(this.eventForm.value, EventID, this.selectedFile)

  }
  onUpload() {
    // upload code goes here

    const uploadData = new FormData();
    var EventidStr = ""
    console.log(this._data.event);

    console.log(this._data.event.eventid);

    uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('Module', 'Events');
    uploadData.append('ID', this._data.event.eventid);
    uploadData.append('SaveFolder', 'Events');
    this._http.post('https://oplaunchapi.azurewebsites.net/api/OP/UploadToAzureStorage', uploadData, {
      reportProgress: true,
      observe: 'events'

    })
      .subscribe(event => {
        console.log(event); // handle event here
      });


  }


  onCountryChange(CountryID) {
    const StateInputData = [];
    var StateInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "CountryID": CountryID };
    StateInputData.push(StateInput);
    const Stateinput = {
      "MethodName": "GetState",
      "InputStr": StateInputData
    }

    this._calendarService.getData(Stateinput).then((data) => {

      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);

        this.StateListItems = jsonobj2.Result;
      }
    });

  }
}
