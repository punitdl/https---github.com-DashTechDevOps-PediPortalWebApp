import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { HttpClient } from '@angular/common/http';
import { casecoverage } from '../casecoverage.model';
import { CasecoveragesService } from '../casecoverages.service';



@Component({
    selector: 'systems-system-form-dialog',
    templateUrl: './casecoverage-form.component.html',
    styleUrls: ['./casecoverage-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CaseCoverageFormDialogComponent {
    action: string;
    casecoverages: casecoverage;
    diseaseForm: FormGroup;
    dialogTitle: string;
    CategoryListItems: any;
    casecoverage: casecoverage;
    CategoryDetails: any
    images = [];
    imageStr: string;
    /**
     * Constructor
     *
     * @param {MatDialogRef<CaseCoverageFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder,
     * @param {CasecoverageService} _casecoverageService
     */
    constructor(
        public matDialogRef: MatDialogRef<CaseCoverageFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _casecoverageService: CasecoveragesService,
        private _http: HttpClient
    ) {
        // _http.get<any[]>('api/systems-categorydata').subscribe(result => {
        //     this.CategoryListItems = result;           
        //   }, error => //console.error(error)); 


        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            //this.dialogTitle = 'Edit Disease';
            this.casecoverage = _data.casecoverage;

            //console.log(this.casecoverage);

            const CoverageDetailInputData = [];
            var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "CaseCoverageID": this.casecoverage.CaseCoverageID };
            CoverageDetailInputData.push(myInput);
            const CoverageDtlinput = {
                "MethodName": "GetCaseCoverageDetail",
                "InputStr": CoverageDetailInputData
            }
            console.log(JSON.stringify(CoverageDtlinput));
            //   this.images.push("https://iili.io/270S2e.jpg");
            //       this.images.push("https://iili.io/271DV2.jpg");
            //console.log(this.images);



            this._casecoverageService.getData(CoverageDtlinput).then((data) => {
                var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                var jsonobj1 = JSON.parse(myObjStr1);
                if (jsonobj1.Result[0]["ErrorID"] > 0) {
                    var jsonStr2 = "";
                    for (let i = 0; i < data["Table2"].length; i++) {
                        jsonStr2 += data["Table2"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                    }
                    if (jsonStr2) {
                        var jsonobj2 = JSON.parse(jsonStr2);
                        this.CategoryDetails = jsonobj2.Result;
                        console.log(this.CategoryDetails);
                        this.images = this.CategoryDetails;
                        console.log(this.images);
                    } else {
                        this.CategoryDetails = [];
                    }
                }
                else {
                    this.CategoryDetails = [];
                }
            });
        }
        else {
            this.dialogTitle = 'New System';
            this.casecoverage = new casecoverage({});
        }

        this.diseaseForm = this.createDiseaseForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create system form
     *
     * @returns {FormGroup}
     */

    createDiseaseForm(): FormGroup {
        return this._formBuilder.group({
            CaseCoverageID: [this.casecoverage.CaseCoverageID],
            Date: [this.casecoverage.Date],
            RepresentativeID: [this.casecoverage.RepresentativeID],
            RepresentativeName: [this.casecoverage.RepresentativeName],
            DiseaseName: [this.casecoverage.DiseaseName],
            HospitalName: [this.casecoverage.HospitalName],
            SurgeonID: [this.casecoverage.SurgeonID],
            SurgeonName: new FormControl({ value: [this.casecoverage.SurgeonName], disabled: true }),
            SurgeonPreference: [this.casecoverage.SurgeonPreference],
            Notes: [this.casecoverage.Notes],
            FormattedDate: [this.casecoverage.FormattedDate],
            FormattedTime: [this.casecoverage.FormattedTime],
            ProcedureName: [this.casecoverage.ProcedureName],
            SystemName: new FormControl({ value: [this.casecoverage.SystemName], disabled: true }),
        });
    }

}
