import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../login/login.service';
import { fuseAnimations } from '@fuse/animations';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {

  widgets: any;
  widgetstemp: any;
  widget1SelectedYearNew = '2021';
  widget1SelectedYear = '2016';
  widget5SelectedDay = 'today';
  campaignOne: FormGroup;
  campaignTwo: FormGroup;

  RepresentativeListItems: any;
  SurgeonListItems: any;
  BrandListItems: any;
  SystemsListItems: any;
  GetRangeFilterListItems: any;
  CaseCoverageListItems: any;
  RangeFilterSelection: any = 1;

  DashboardVisitorsYears: any;
  DashboardVisitorsData: any;
  VisitorsChartData: any = [];
  DashboardData: any;
  DashboardUsageAnatomy: any;
  DashboardUsageSystems: any;
  DashboardTopSearch: any;
  DashboardDocShared: any;
  OnBoardingListItems: any;

  BrandSelected: any = 0;

  UsageFlag: any = "A";
  RepresentativeFilter: any = -1;
  SurgeonFilter: any = -1;



  dataSourcecolumns = ['avatar', 'name', 'position', 'office', 'email', 'phone'];

  /**
   * Constructor
   *
   * @param {DashboardService} _analyticsDashboardService
   */
  constructor(
    private _DashboardService: DashboardService,
    private _LoginService: LoginService
  ) {
    // Register the custom chart.js plugin
    // this._registerCustomChartJSPlugin();
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.GetDashboardVisitorsData();
    this.GetRangeFilter();
    this.GetCaseCoverage();
    this.GetRepresentative();
    this.GetSurgeon();
    this.GetBrand();
    this.GetSystems();
    
    // Get the widgets from the service
    this.widgets = {

      "widget1A": {
        "ranges": {
          "DY": "Yesterday",
          "DT": "Today",
          "DTM": "Tomorrow"
        },
        "newranges": {
          "DY": "Last 1 Week",
          "DT": "Last Fortnight",
          "DTM": "Last 1 Month",
          "DTM1": "Last 3 Months",
          "DTM2": "Last 6 Months",
          "DTM3": "Last 1 Year"
        },
        "currentRange": "DY",
        "data": {
          "label": "Case Coverage",
          "count": {
            "DY": 21,
            "DT": 492,
            "DTM": 19
          },
          "extra": {
            "label": "Completed",
            "count": {
              "DY": 6,
              "DT": 7,
              "DTM": "-"
            }

          }
        },
        "detail": "You can show some detailed information about this widget in here."
      },
      "widget2A": {
        "title": "Overdue",
        "data": {
          "label": "User Visits",
          "count": "47k",
          "extra": {
            "label": "Yesterday\"s overdue",
            "count": 2
          }
        },
        "detail": "You can show some detailed information about this widget in here."
      },
      "widget3A": {
        "title": "Issues",
        "data": {
          "label": "Onboarding Complete",
          "count": 32,
          "extra": {
            "label": "Closed today",
            "count": 0
          }
        },
        "detail": "You can show some detailed information about this widget in here."
      },
      "widget4A": {
        "title": "Features",
        "data": {
          "label": "Document Shared",
          "count": 42,
          "extra": {
            "label": "Implemented",
            "count": 8
          }
        },
        "detail": "You can show some detailed information about this widget in here."
      },
      'widget11': {
        'title': 'Team Members',
        'table': {
          'columns': ['avatar', 'name', 'position', 'office', 'email', 'phone'],
          'rows': [
            {
              avatar: 'assets/images/avatars/james.jpg',
              name: 'Jack Gilbert',
              position: 'Design Manager',
              office: 'Johor Bahru',
              email: 'jgilbert48@mail.com',
              phone: '+16 298 032 7774'
            },
            {
              avatar: 'assets/images/avatars/katherine.jpg',
              name: 'Kathy Anderson',
              position: 'Recruiting Manager',
              office: 'Solţānābād',
              email: 'kanderson49@mail.com.br',
              phone: '+23 572 311 1136'
            },
            {
              avatar: 'assets/images/avatars/andrew.jpg',
              name: 'Mark Turner',
              position: 'Recruiting Manager',
              office: 'Neftegorsk',
              email: 'mturner4a@mail.com',
              phone: '+01 139 803 9263'
            },
            {
              avatar: 'assets/images/avatars/jane.jpg',
              name: 'Kathryn Martinez',
              position: 'Director of Sales',
              office: 'Palekastro',
              email: 'kmartinez4b@mail.com',
              phone: '+25 467 022 5393'
            },
            {
              avatar: 'assets/images/avatars/alice.jpg',
              name: 'Annie Gonzales',
              position: 'Actuary',
              office: 'Candon',
              email: 'agonzales4c@mail.edu',
              phone: '+99 891 619 7138'
            },
            {
              avatar: 'assets/images/avatars/vincent.jpg',
              name: 'Howard King',
              position: 'Human Resources',
              office: 'Bergen op Zoom',
              email: 'hking4d@mail.gov',
              phone: '+46 984 348 1409'
            },
            {
              avatar: 'assets/images/avatars/joyce.jpg',
              name: 'Elizabeth Dixon',
              position: 'Electrical Engineer',
              office: 'Písečná',
              email: 'edixon4e@mail.gov',
              phone: '+33 332 067 9063'
            },
            {
              avatar: 'assets/images/avatars/danielle.jpg',
              name: 'Dorothy Morris',
              position: 'Office Assistant',
              office: 'Magsaysay',
              email: 'dmorris4f@mail.com',
              phone: '+05 490 958 6120'
            },
            {
              avatar: 'assets/images/avatars/carl.jpg',
              name: 'Mark Gonzales',
              position: 'Quality Control',
              office: 'Matsue-shi',
              email: 'mgonzales4g@mail.com',
              phone: '+03 168 394 9935'
            },
            {
              avatar: 'assets/images/avatars/profile.jpg',
              name: 'Catherine Rogers',
              position: 'Programmer Analyst',
              office: 'Kangar',
              email: 'crogers4h@mail.com',
              phone: '+86 235 407 5373'
            },
            {
              avatar: 'assets/images/avatars/garry.jpg',
              name: 'Ruth Grant',
              position: 'Community Outreach',
              office: 'Beaune',
              email: 'rgrant4i@mail.pl',
              phone: '+36 288 083 8460'
            },
            {
              avatar: 'assets/images/avatars/james.jpg',
              name: 'Phyllis Gutierrez',
              position: 'Administrative Assistant',
              office: 'Shlissel’burg',
              email: 'pgutierrez4j@mail.net',
              phone: '+52 749 861 9304'
            }, {
              avatar: 'assets/images/avatars/alice.jpg',
              name: 'Lillian Morris',
              position: 'Media Planner',
              office: 'Berlin',
              email: 'lmorris4k@mail.de',
              phone: '+59 695 110 3856'
            }, {
              avatar: 'assets/images/avatars/vincent.jpg',
              name: 'Jeremy Anderson',
              position: 'Systems Engineer',
              office: 'Lũng Hồ',
              email: 'janderson4l@mail.uk',
              phone: '+40 384 115 1448'
            },
            {
              avatar: 'assets/images/avatars/carl.jpg',
              name: 'Arthur Lawrence',
              position: 'Nurse Practicioner',
              office: 'Sarkanjut',
              email: 'alawrence4m@mail.com',
              phone: '+36 631 599 7867'
            }, {
              avatar: 'assets/images/avatars/andrew.jpg',
              name: 'David Simmons',
              position: 'Social Worker',
              office: 'Ushumun',
              email: 'dsimmons4n@mail.com',
              phone: '+01 189 681 4417'
            }, {
              avatar: 'assets/images/avatars/danielle.jpg',
              name: 'Daniel Johnston',
              position: 'Help Desk',
              office: 'São Carlos',
              email: 'djohnston4o@mail.gov',
              phone: '+60 028 943 7919'
            },

            {
              avatar: 'assets/images/avatars/joyce.jpg',
              name: 'Ann King',
              position: 'Internal Auditor',
              office: 'Liren',
              email: 'aking4p@mail.com',
              phone: '+91 103 932 6545'
            },
            {
              avatar: 'assets/images/avatars/james.jpg',
              name: 'Phillip Franklin',
              position: 'VP Accounting',
              office: 'Soba',
              email: 'pfranklin4q@mail.com',
              phone: '+25 820 986 7626'
            },
            {
              avatar: 'assets/images/avatars/garry.jpg',
              name: 'Gary Gonzalez',
              position: 'Speech Pathologist',
              office: 'Gangkou',
              email: 'ggonzalez4r@mail.cc',
              phone: '+10 862 046 7916'
            }
          ]
        }
      },
      "widget1": {
        "chartType": "line",
        "datasets": {
          "2016": [{ "label": "Sales", "data": [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9], "fill": "start" }],
          "2017": [{ "label": "Sales", "data": [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8], "fill": "start" }],
          "2018": [{ "label": "Sales", "data": [3.9, 2.5, 3.8], "fill": "start" }]
        },
        "labels": ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],


        "colors": [{
          "borderColor": "#42a5f5", "backgroundColor": "#42a5f5", "pointBackgroundColor": "#1e88e5", "pointHoverBackgroundColor": "#1e88e5",
          "pointBorderColor": "#ffffff", "pointHoverBorderColor": "#ffffff"
        }], "options": {
          "spanGaps": false, "legend": { "display": false },
          "maintainAspectRatio": false,
          "layout": { "padding": { "top": 32, "left": 32, "right": 32 } }, "elements": {
            "point": { "radius": 4, "borderWidth": 2, "hoverRadius": 4, "hoverBorderWidth": 2 },
            "line": { "tension": 0 }
          }, "scales": {
            "xAxes": [{
              "gridLines": { "display": false, "drawBorder": false, "tickMarkLength": 18 },
              "ticks":
                { "fontColor": "#ffffff" }
            }],
            "yAxes": [{
              "display": false,
              "ticksorg": { "min": 1.5, "max": 5, "stepSize": 0.5 },
              "ticks": { "min": 1, "max": 500, "stepSize": 10 }
            }]
          },
          "plugins": { "filler": { "propagate": false }, "xLabelsOnTop": { "active": true } }
        }
      },

      "widget2": { "conversion": { "value": 492, "ofTarget": 13 }, "chartType": "bar", "datasets": [{ "label": "Conversion", "data": [221, 428, 492, 471, 413, 344, 294] }], "labels": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "colors": [{ "borderColor": "#42a5f5", "backgroundColor": "#42a5f5" }], "options": { "spanGaps": false, "legend": { "display": false }, "maintainAspectRatio": false, "layout": { "padding": { "top": 24, "left": 16, "right": 16, "bottom": 16 } }, "scales": { "xAxes": [{ "display": false }], "yAxes": [{ "display": false, "ticks": { "min": 100, "max": 500 } }] } } }, "widget3": { "impressions": { "value": "87k", "ofTarget": 12 }, "chartType": "line", "datasets": [{ "label": "Impression", "data": [67000, 54000, 82000, 57000, 72000, 57000, 87000, 72000, 89000, 98700, 112000, 136000, 110000, 149000, 98000], "fill": false }], "labels": ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7", "Jan 8", "Jan 9", "Jan 10", "Jan 11", "Jan 12", "Jan 13", "Jan 14", "Jan 15"], "colors": [{ "borderColor": "#5c84f1" }], "options": { "spanGaps": false, "legend": { "display": false }, "maintainAspectRatio": false, "elements": { "point": { "radius": 2, "borderWidth": 1, "hoverRadius": 2, "hoverBorderWidth": 1 }, "line": { "tension": 0 } }, "layout": { "padding": { "top": 24, "left": 16, "right": 16, "bottom": 16 } }, "scales": { "xAxes": [{ "display": false }], "yAxes": [{ "display": false, "ticks": {} }] } } }, "widget4": { "visits": { "value": 882, "ofTarget": -9 }, "chartType": "bar", "datasets": [{ "label": "Visits", "data": [432, 428, 327, 363, 456, 267, 231] }], "labels": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "colors": [{ "borderColor": "#f44336", "backgroundColor": "#f44336" }], "options": { "spanGaps": false, "legend": { "display": false }, "maintainAspectRatio": false, "layout": { "padding": { "top": 24, "left": 16, "right": 16, "bottom": 16 } }, "scales": { "xAxes": [{ "display": false }], "yAxes": [{ "display": false, "ticks": { "min": 150, "max": 500 } }] } } }, "widget5": { "chartType": "line", "datasets": { "yesterday": [{ "label": "Visitors", "data": [190, 300, 340, 220, 290, 390, 250, 380, 410, 380, 320, 290], "fill": "start" }, { "label": "Page views", "data": [2200, 2900, 3900, 2500, 3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800], "fill": "start" }], "today": [{ "label": "Visitors", "data": [410, 380, 320, 290, 190, 390, 250, 380, 300, 340, 220, 290], "fill": "start" }, { "label": "Page Views", "data": [3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900, 2900, 3900, 2500, 3800], "fill": "start" }] }, "labels": ["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"], "colors": [{ "borderColor": "#3949ab", "backgroundColor": "#3949ab", "pointBackgroundColor": "#3949ab", "pointHoverBackgroundColor": "#3949ab", "pointBorderColor": "#ffffff", "pointHoverBorderColor": "#ffffff" }, { "borderColor": "rgba(30, 136, 229, 0.87)", "backgroundColor": "rgba(30, 136, 229, 0.87)", "pointBackgroundColor": "rgba(30, 136, 229, 0.87)", "pointHoverBackgroundColor": "rgba(30, 136, 229, 0.87)", "pointBorderColor": "#ffffff", "pointHoverBorderColor": "#ffffff" }], "options": { "spanGaps": false, "legend": { "display": false }, "maintainAspectRatio": false, "tooltips": { "position": "nearest", "mode": "index", "intersect": false }, "layout": { "padding": { "left": 24, "right": 32 } }, "elements": { "point": { "radius": 4, "borderWidth": 2, "hoverRadius": 4, "hoverBorderWidth": 2 } }, "scales": { "xAxes": [{ "gridLines": { "display": false }, "ticks": { "fontColor": "rgba(0,0,0,0.54)" } }], "yAxes": [{ "gridLines": { "tickMarkLength": 16 }, "ticks": { "stepSize": 1000 } }] }, "plugins": { "filler": { "propagate": false } } } }, "widget6": { "markers": [{ "lat": 52, "lng": -73, "label": "120" }, { "lat": 37, "lng": -104, "label": "498" }, { "lat": 21, "lng": -7, "label": "443" }, { "lat": 55, "lng": 75, "label": "332" }, { "lat": 51, "lng": 7, "label": "50" }, { "lat": 31, "lng": 12, "label": "221" }, { "lat": 45, "lng": 44, "label": "455" }, { "lat": -26, "lng": 134, "label": "231" }, { "lat": -9, "lng": -60, "label": "67" }, { "lat": 33, "lng": 104, "label": "665" }], "styles": [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#039be5" }, { "visibility": "on" }] }] }, "widget7": { "scheme": { "domain": ["#4867d2", "#5c84f1", "#89a9f4"] }, "devices": [{ "name": "Desktop", "value": 92.8, "change": -0.6 }, { "name": "Mobile", "value": 6.1, "change": 0.7 }, { "name": "Tablet", "value": 1.1, "change": 0.1 }] }, "widget8": { "scheme": { "domain": ["#5c84f1"] }, "today": "12,540", "change": { "value": 321, "percentage": 2.05 }, "data": [{ "name": "Sales", "series": [{ "name": "Jan 1", "value": 540 }, { "name": "Jan 2", "value": 539 }, { "name": "Jan 3", "value": 538 }, { "name": "Jan 4", "value": 539 }, { "name": "Jan 5", "value": 540 }, { "name": "Jan 6", "value": 539 }, { "name": "Jan 7", "value": 540 }] }], "dataMin": 538, "dataMax": 541 },
      "widget9": {
        "rows": [
          { "title": "Acetabulum", "clicks": 3621, "conversion": 90 },
          { "title": "Femur", "clicks": 703, "conversion": 7 },
          { "title": "Foot/Ankle", "clicks": 532, "conversion": 0 },
          { "title": "Radius", "clicks": 201, "conversion": 8 },
          { "title": "Clavicle	", "clicks": 94, "conversion": 4 }]
      }
    };

    //this.widgets.widget11.dataSource = new FilesDataSource(this.widgets.widget11);

    this.widgets.widget11.dataSource = new MatTableDataSource(this.widgets.widget11);

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register a custom plugin
   */
  private _registerCustomChartJSPlugin(): void {
    (window as any).Chart.plugins.register({
      afterDatasetsDraw: function (chart, easing): any {
        // Only activate the plugin if it's made available
        // in the options
        if (
          !chart.options.plugins.xLabelsOnTop ||
          (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
        ) {
          return;
        }

        // To only draw at the end of animation, check for easing === 1
        const ctx = chart.ctx;

        chart.data.datasets.forEach(function (dataset, i): any {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index): any {

              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              const fontSize = 13;
              const fontStyle = 'normal';
              const fontFamily = 'Roboto, Helvetica Neue, Arial';
              ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

              // Just naively convert to string for now
              const dataString = dataset.data[index].toString() + 'k';

              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              const padding = 15;
              const startY = 24;
              const position = element.tooltipPosition();
              ctx.fillText(dataString, position.x, startY);

              ctx.save();

              ctx.beginPath();
              ctx.setLineDash([5, 3]);
              ctx.moveTo(position.x, startY + padding);
              ctx.lineTo(position.x, position.y - padding);
              ctx.strokeStyle = 'rgba(255,255,255,0.12)';
              ctx.stroke();

              ctx.restore();
            });
          }
        });
      }
    });
  }
  

  GetBrand() {
    const RepInputData = [];
    var RepInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D"
    };
    RepInputData.push(RepInput);
    const inputdata = {
      "MethodName": "GetBrand",
      "InputStr": RepInputData
    }
    this._DashboardService.GetBrands().then((data) => {
      debugger;
        if(data.meta.status){
        this.BrandListItems = data.data;
        }
        else{
          this.BrandListItems = [];
        }
    });

  }

  GetRangeFilter() {
    debugger;
    this._DashboardService.GetRangeFilter().then((data) => {
      debugger;
      if (data.meta.status) {
       
        this.GetRangeFilterListItems =data.data;
        this.LoadDashboardContent("1")
      }
      else {
        this.GetRangeFilterListItems = [];
      }
    });

  }

  GetRepresentative() {
    const RepInputData = [];
    var RepInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D"
    };
    RepInputData.push(RepInput);
    const inputdata = {
      "MethodName": "GetRepresentative",
      "InputStr": RepInputData
    }
    this._LoginService.CommonInvokeData(inputdata).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);

        this.RepresentativeListItems = jsonobj2.Result;

      }
      else {
        this.RepresentativeListItems = [];
      }
    });

  }

  GetSurgeon() {
    const RepInputData = [];
    var RepInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D"
    };
    RepInputData.push(RepInput);
    const inputdata = {
      "MethodName": "GetSurgeon",
      "InputStr": RepInputData
    }
    this._LoginService.CommonInvokeData(inputdata).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);

        this.SurgeonListItems = jsonobj2.Result;

      }
      else {
        this.SurgeonListItems = [];
      }
    });

  }


  GetSystems() {
    
    var RepInput = {
      "UserID": localStorage.getItem('UserID'),
      "SearchText": "",
      "BrandID": this.BrandSelected
    };
    
    this._DashboardService.GetSystems(RepInput).then((data) => {
      if (data.meta.status) {
        this.SystemsListItems = data.data;
      }
      else {
        this.SystemsListItems = [];
      }
    });

  }

  GetCaseCoverage() {
    const RepInputData = [];
    var RepInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D",
      "RepresentativeID": this.RepresentativeFilter,
      "SurgeonID": this.SurgeonFilter,
      "RangeFilterID": this.RangeFilterSelection,
      "HospitalID": -1
    };
    
    RepInputData.push(RepInput);
    const inputdata = {
      "MethodName": "GetCaseCoverage",
      "InputStr": RepInputData
    }

    console.log(JSON.stringify(inputdata));
    this._LoginService.CommonInvokeData(inputdata).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);

        this.CaseCoverageListItems = jsonobj2.Result;
        console.log(this.CaseCoverageListItems)

      }
      else {
        this.CaseCoverageListItems = [];
      }
    });

  }


  GetDashboardVisitorsData() {
    const RepInputData = [];
    var RepInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D",
      "BrandFilterIDs": [this.BrandSelected]
    };
    RepInputData.push(RepInput);
    const inputdata = {
      "MethodName": "GetDashboardVisitorView",
      "InputStr": RepInputData
    }
    this._LoginService.CommonInvokeData(inputdata).then((data) => {
      console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2;
        if (jsonStr2 != "") {
          jsonobj2 = JSON.parse(jsonStr2);
          this.DashboardVisitorsData = jsonobj2.datasets[0];
        }
        else {
          this.DashboardVisitorsData = [];
        }
        // console.log(jsonobj2.datasets[0]);
        // console.log('this.widgets.widget1.datasets[2021]');
        // console.log(this.widgets.widget1.datasets);

        var jsonStr3 = "";
        for (let i = 0; i < data["Table2"].length; i++) {
          jsonStr3 += data["Table2"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj3;
        if (jsonStr3 != "") {
          jsonobj3 = JSON.parse(jsonStr3);
          this.DashboardVisitorsYears = jsonobj3.Result;
          console.log(this.DashboardVisitorsYears);
        }
        else {
          this.DashboardVisitorsYears = [];
        }
      }
      else {
        this.DashboardVisitorsYears = [];
        this.DashboardVisitorsData = [];
        this.VisitorsChartData = [];
      }
    });

  }


  OnBrandChange() {
    this.GetSystems();
  }
  LoadDashboardContent(key) {
    this.RangeFilterSelection = key;
    const RepInputData = [];
    var RepInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D",
      "RangeFilterID": this.RangeFilterSelection
    };
    RepInputData.push(RepInput);
    const inputdata = {
      "MethodName": "GetDashboardView",
      "InputStr": RepInputData
    }

    this._LoginService.CommonInvokeData(inputdata).then((data) => {
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2;
        if (jsonStr2 != "") {
          jsonobj2 = JSON.parse(jsonStr2);
          this.DashboardData = jsonobj2.Result;
        }
        else {
          this.DashboardData = [];
        }

        var jsonStr3 = "";
        for (let i = 0; i < data["Table2"].length; i++) {
          jsonStr3 += data["Table2"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj3;
        if (jsonStr3 != "") {
          jsonobj3 = JSON.parse(jsonStr3);
          this.DashboardUsageAnatomy = jsonobj3.Result;
        }
        else {
          this.DashboardUsageAnatomy = [];
        }


        var jsonStr4 = "";
        for (let i = 0; i < data["Table3"].length; i++) {
          jsonStr4 += data["Table3"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj4;
        if (jsonStr4 != "") {
          jsonobj4 = JSON.parse(jsonStr4);
          this.DashboardUsageSystems = jsonobj4.Result;
        }
        else {
          this.DashboardUsageSystems = [];
        }



        var jsonStr5 = "";
        for (let i = 0; i < data["Table4"].length; i++) {
          jsonStr5 += data["Table4"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj5;
        if (jsonStr5 != "") {
          jsonobj5 = JSON.parse(jsonStr5);
          this.DashboardTopSearch = jsonobj5.Result;
        }
        else {
          this.DashboardTopSearch = [];
        }

        var jsonStr6 = "";
        for (let i = 0; i < data["Table5"].length; i++) {
          jsonStr6 += data["Table5"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj6;
        if (jsonStr6 != "") {
          jsonobj6 = JSON.parse(jsonStr6);
          this.DashboardDocShared = jsonobj6.Result;
        }
        else {
          this.DashboardDocShared = [];
        }

        //
        var jsonStr7 = "";
        for (let i = 0; i < data["Table6"].length; i++) {
          jsonStr7 += data["Table6"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj7;
        if (jsonStr7 != "") {
          jsonobj7 = JSON.parse(jsonStr7);
          this.OnBoardingListItems = jsonobj7.Result;
        }
        else {
          this.OnBoardingListItems = [];
        }

      }
      else {
        this.GetRangeFilterListItems = [];
      }
    });

    this.GetCaseCoverage();

  }
}

export class FilesDataSource extends DataSource<any>
{
  /**
   * Constructor
   *
   * @param _widget11
   */
  constructor(private _widget11) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._widget11.onContactsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }
}
