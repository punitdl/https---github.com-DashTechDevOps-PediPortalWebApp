import { Component, OnDestroy, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Product } from './product.model';
import { EcommerceProductService } from './product.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchdocComponent } from '../searchdoc/searchdoc.component';
import { HttpClient } from '@angular/common/http';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TrainingsService } from 'app/main/trainings/trainings.service';


@Component({
    selector: 'e-commerce-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EcommerceProductComponent implements OnInit, OnDestroy {
    product: Product;
    pageType: string;
    productForm: FormGroup;
    dialogContent: TemplateRef<any>;
    dialogRef: any;
    CategoryListItems: any;
    SystemListItems: any;
    SourceListItems: any;
    SourceTitleListItems: any;
    selectedSource: any = "";
    form: FormGroup;
    AnatomyListItems: any;
    TypeListItems: any;
    DiseaseListItems: any;
    ProcedureListItems: any;
    selectedanatomy: any;
    selecteddisease: any;
    selectedprocedure: any;
    selectedtrainingmeterial: any;
    public contactList: FormArray;

    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;

    AnatomyFilter: any = [-1];
    brandfilterBy: number[] = [-1];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

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


    }


    AddDocuments() {

    }

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _ecommerceProductService: EcommerceProductService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        public _matDialog: MatDialog,
        private _http: HttpClient,
        private _trainingsService: TrainingsService
    ) {
        // Set the default
        this.product = new Product();

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        const BrandInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        BrandInputData.push(myInput);
        const Brandinput = {
            "MethodName": "GetBrand",
            "InputStr": BrandInputData
        }


        this._ecommerceProductService.getBrands(Brandinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";
                // console.log(data["Table1"].length);
                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);

                this.CategoryListItems = jsonobj2.Result;
            }
        });

        const UserInputData = [];
        var mysysyInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "BrandFilterIDs": this.brandfilterBy };
        UserInputData.push(mysysyInput);
        const Userinput = {
            "MethodName": "getSystem",
            "InputStr": UserInputData
        }

        this._ecommerceProductService.getSystems(Userinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";
                // console.log(data["Table1"].length);
                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);

                this.SystemListItems = jsonobj2.Result;
            }
        });
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        UserInputData.push(myInput);
        const Usertypeinput = {
            "MethodName": "GetResourceType",
            "InputStr": UserInputData
        }

        this._ecommerceProductService.getResourceType(Usertypeinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";

                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);
                //    console.log(jsonobj2);
                this.TypeListItems = jsonobj2.Result;
            }
        });

        const TrainingSourceInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        TrainingSourceInputData.push(myInput);
        const TrainingSourceInput = {
            "MethodName": "GetTrainingSource",
            "InputStr": TrainingSourceInputData
        }

        this._trainingsService.getData(TrainingSourceInput).then((data) => {
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
                this.SourceListItems = jsonobj2.Result;
            }
        });


        const TrainingMeterialInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        TrainingMeterialInputData.push(myInput);
        const TrainingMeterialInput = {
            "MethodName": "GetTrainingMaterial",
            "InputStr": TrainingMeterialInputData
        }

        this._trainingsService.getData(TrainingMeterialInput).then((data) => {
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
                this.SourceTitleListItems = jsonobj2.Result;
            }
        });
        var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
        UserInputData.push(myInput);
        const UserAnatomyinput = {
            "MethodName": "GetAnatomy",
            "InputStr": UserInputData
        }
        this._ecommerceProductService.getAnatomy(UserAnatomyinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";

                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);
                //    console.log(jsonobj2);
                this.AnatomyListItems = jsonobj2.Result;
            }
        });
        this.getProcedures();
        this.getDisease();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to update product on changes
        this._ecommerceProductService.onProductChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {

                if (product) {

                    //  this.product = new Product(product);

                    //console.log(product);
                    //   //console.log(product[0].Result[0].ProductName);
                    //   //console.log(product[0].Result[0].BrandID);
                    this.setProductDetail(product);
                    this.pageType = 'edit';


                }
                else {
                    this.pageType = 'new';
                    this.product = new Product();
                }

                this.productForm = this.createProductForm();
                this.LoadDocFromDB(product[4].Result);
                this.LoadTraFromDB(product[3].Result);

            });

        this.contactList = this.productForm.get('documents') as FormArray;
        this.addContact2();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // add a contact form group
    addContact() {
        this.contactList.push(this.createContact());
    }


    addContact2() {
        this.contactList.push(this._formBuilder.group({
            default: true,
            documentid: "",
            url: "IFU/Bowed-Femur.doc",
            type: "2",
            name: "IFU (Bowed Femur)",
            share: false
        }));
    }
    // remove contact from group
    removeContact(index) {
        this.contactList.removeAt(index);
    }

    createContact(): FormGroup {
        return this._formBuilder.group({
            default: true,
            documentid: "",
            url: "",
            type: "",
            name: "",
            share: false
        });
    }

    //     [this._formBuilder.group({default:true,documentid : "", url: "",type:"",name:"",share:""})]
    //     )
    get DocumentPoints() {
        return this.productForm.get('documents') as FormArray;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup {
        return this._formBuilder.group({
            ProductID: [this.product.ProductID],
            ProductName: [this.product.ProductName],
            BrandID: [this.product.BrandID],
            BrandName: [this.product.BrandName],
            ImageURL: [this.product.ImageURL],
            SystemID: [this.product.SystemID],
            systemname: [this.product.systemname],
            //    handle: [this.product.handle],
            ProductDescription: [this.product.ProductDescription],
            // categories: [this.product.categories],
            // tags: [this.product.tags],
            images: [this.product.images],
            // priceTaxExcl: [this.product.priceTaxExcl],
            // priceTaxIncl: [this.product.priceTaxIncl],
            // taxRate: [this.product.taxRate],
            // comparedPrice: [this.product.comparedPrice],
            // quantity: [this.product.quantity],
            // sku: [this.product.sku],
            // width: [this.product.width],
            // height: [this.product.height],
            // depth: [this.product.depth],
            // weight: [this.product.weight],
            // extraShippingFee: [this.product.extraShippingFee],
            // active: [this.product.active],
            AnatomyID: [this.product.AnatomyID],
            DiseaseID: [this.product.DiseaseID],
            ProcedureID: [this.product.ProcedureID],
            TrainingMaterialID: [this.product.TrainingMaterialID],
            SystemResource: this._formBuilder.array([]),
            SystemTrainingMaterial: this._formBuilder.array([]),

            //documents: this._formBuilder.array([this.createContact()]),
            documents: this._formBuilder.array(
                [this._formBuilder.group(
                    {
                        default: true, documentid: "",
                        url: "IFU/Contoured-Femur.doc",
                        type: "2", name: "IFU (Contoured Femur)", share: ""
                    })
                ]
            ),
            Training: this._formBuilder.array(
                [this._formBuilder.group(
                    {
                        TrainingSourceName: "",
                        TrainingSourceID: "",
                        TrainingMaterialID: "",
                        TrainingMaterialName: "",
                        LinkURL: ""
                    })
                ]
            )
        });
    }

    addDocumentFormGroup(): FormGroup {
        return this._formBuilder.group({
            SystemID: [this.product.ProductID],
            ProductResourceID: [''],
            ResourceTypeID: ['', Validators.required],
            ResourceTypeName: ['', Validators.required],
            ResourceURL: ['', Validators.required],
            Sharable: false,
            DocumentID: ''
            //   education: ['', Validators.required],  
            //   age : ['', Validators.required],  
            //   degree: ['Bachelor', Validators.required]  
        });
    }

    addTrainingFormGroup(): FormGroup {
        return this._formBuilder.group({
            SystemID: [this.product.ProductID],
            TrainingMaterialID: [''],
            TrainingSourceID: ['', Validators.required],
            TrainingMaterialName: ['', Validators.required],
            TrainingSourceName: ['', Validators.required],
            LinkURL: ['']
        });
    }

    public removeButtonClick(i, newitem) {
        //(<FormArray>this.productForm.get('SystemResource')).removeAt(i);  
        //alert(newitem.value.ProductResourceID +"_" + i);
        console.log(newitem);
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const DeleteProductResourceInputData = [];
                var myInput = {
                    "UserID": sessionStorage.getItem('UserID'),
                    "Device": "D",
                    "ProductResourceID": newitem.value.ProductResourceID
                };

                DeleteProductResourceInputData.push(myInput);
                const input = {
                    "MethodName": "DeleteProductResource",
                    "InputStr": DeleteProductResourceInputData
                }
                console.log(JSON.stringify(input));
                this._ecommerceProductService.DeleteProductResource(input);
                (<FormArray>this.productForm.get('SystemResource')).removeAt(i);
            }
            this.confirmDialogRef = null;
        });

    }

    public removeTrainingClick(i) {
        (<FormArray>this.productForm.get('SystemTrainingMaterial')).removeAt(i);
    }

    public removeProductClick(i) {
        (<FormArray>this.productForm.get('productnew')).removeAt(i);
    }

    addDocumentClick(): void {
        (<FormArray>this.productForm.get('SystemResource')).push(this.addDocumentFormGroup());
    }

    addTrainingClick(): void {
        (<FormArray>this.productForm.get('SystemTrainingMaterial')).push(this.addTrainingFormGroup());
    }

    //   addProductClick(): void {  
    //     (<FormArray>this.productForm.get('productnew')).push(this.addProductFormGroup());  
    //   }  


    LoadDocFromDB(DocData: any): void {
        //console.log(DocData);
        //console.log(DocData.length);
        for (let i = 0; i < DocData.length; i++) {
            (<FormArray>this.productForm.get('SystemResource')).push(
                this._formBuilder.group({
                    SystemID: [this.product.ProductID],
                    ProductResourceID: [DocData[i].ProductResourceID],
                    ResourceTypeID: [DocData[i].ResourceTypeID, Validators.required],
                    ResourceTypeName: [DocData[i].ResourceTypeName, Validators.required],
                    ResourceURL: [DocData[i].ResourceURL, Validators.required],
                    Sharable: [DocData[i].Sharable],
                    DocumentID: [DocData[i].DocumentID]
                })
            );
        }
    }

    GetDocFromList() {
        //console.log(this.productForm.get('SystemResource').value);
        const DocListData = {
            'UserID': sessionStorage.getItem('UserID'),
            'Device': 'D',
            'SelectedSystemDoc': this.productForm.get('SystemResource').value
        };
        const Userinput = {
            "MethodName": "SaveSystemDocumets",
            "InputStr": DocListData
        }
        //console.log(JSON.stringify(Userinput));
        return;
        // this._ecommerceProductService.getBrand(Userinput).then((data) => {
        //     console.log(data);
        //     var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        //     var jsonobj1 = JSON.parse(myObjStr1);
        //     if (jsonobj1.Result[0]["ErrorID"] > 0)
        //     {
        //       var jsonStr2 ="";                 
        //       for (let i = 0; i < data["Table1"].length; i++) {
        //         jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
        //       }
        //       var jsonobj2 = JSON.parse(jsonStr2);                 
        //       this.CategoryListItems=jsonobj2.Result;
        //       console.log(this.CategoryListItems);
        // }
        // });




    }



    LoadTraFromDB(TraData: any): void {
        //console.log(TraData);
        //console.log(TraData.length);
        for (let i = 0; i < TraData.length; i++) {
            (<FormArray>this.productForm.get('SystemTrainingMaterial')).push(
                this._formBuilder.group({
                    SystemID: [this.product.ProductID],
                    TrainingMaterialID: [TraData[i].TrainingMaterialID],
                    TrainingSourceID: [TraData[i].TrainingSourceID, Validators.required],
                    TrainingMaterialName: [TraData[i].TrainingMaterialName, Validators.required],
                    TrainingSourceName: [TraData[i].TrainingSourceName, Validators.required],
                    LinkURL: [TraData[i].LinkURL, Validators.required]
                })
            );
        }
    }

    LoadProFromDB(ProData: any): void {
        for (let i = 0; i < ProData.length; i++) {
            (<FormArray>this.productForm.get('productnew')).push(
                this._formBuilder.group({
                    SystemID: [this.product.ProductID],
                    ProductID: [ProData[i].ProductID],
                    ProductName: [ProData[i].ProductName, Validators.required],
                    BrandName: [ProData[i].BrandName, Validators.required],
                    ImageURL: [ProData[i].ImageURL, Validators.required],
                    TrainingMaterialCount: [ProData[i].TrainingMaterialCount, Validators.required],
                    ResourceCount: [ProData[i].ResourceCount, Validators.required],
                })
            );
        }
    }


    /**
     * Save product
     * 
     */
    saveProduct(): void {
        const data = this.productForm.getRawValue();

        // console.log(JSON.stringify(data));
        // data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product saved', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });
            });
    }

    /**
     * Add product
     */
    addProduct(): void {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product added', 'OK', {
                    verticalPosition: 'top',
                    duration: 2000
                });

                // Change the location with new one
                this._location.go('apps/e-commerce/products/' + this.product.ProductID);
            });
    }
    searchDoc_popup(docdata): void {
        this.dialogRef = this._matDialog.open(SearchdocComponent, {
            panelClass: 'system-form-dialog',
            data: {
                system: docdata,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':

                        //this._systemsService.updateSystem(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        // this.deleteSystem(system);

                        break;
                }
            });
    }

    finishHorizontalStepper(): void {
        alert('You have finished the horizontal stepper!');
    }
    onAnatomyChange(event: any) {
        this.AnatomyFilter = event.value;
        this.getProcedures();
        this.getDisease();
    }
    getProcedures() {

        const UserInputData = [];
        var myProcedureInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "AnatomyFilterIDs": this.AnatomyFilter };
        UserInputData.push(myProcedureInput);
        const UserProcedureinput = {
            "MethodName": "GetProcedure",
            "InputStr": UserInputData
        }
        this._ecommerceProductService.getDisease(UserProcedureinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";

                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);
                //    console.log(jsonobj2);
                this.ProcedureListItems = jsonobj2.Result;
            }
        });
    }
    getDisease() {
        const UserInputData = [];
        var myDiseaseInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D", "AnatomyFilterIDs": this.AnatomyFilter };
        UserInputData.push(myDiseaseInput);
        const UserDiseaseinput = {
            "MethodName": "GetDisease",
            "InputStr": UserInputData
        }
        this._ecommerceProductService.getDisease(UserDiseaseinput).then((data) => {

            var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            var jsonobj1 = JSON.parse(myObjStr1);
            if (jsonobj1.Result[0]["ErrorID"] > 0) {
                var jsonStr2 = "";

                for (let i = 0; i < data["Table1"].length; i++) {
                    jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                var jsonobj2 = JSON.parse(jsonStr2);

                this.DiseaseListItems = jsonobj2.Result;
            }
        });
    }
    setProductDetail(product) {
        this.product.ProductID = product[0].Result[0].ProductID;
        this.product.ProductName = product[0].Result[0].ProductName;
        this.product.BrandID = product[0].Result[0].BrandID;
        this.product.SystemID = product[0].Result[0].SystemID;
        this.product.ImageURL = product[0].Result[0].ImageURL;
        product.AnatomyID = product[0].Result[0].AnatomyID;
        product.DiseaseID = product[0].Result[0].DiseaseID;
        product.ProcedureID = product[0].Result[0].ProcedureID;
        product.TrainingMaterialID = product[0].Result[0].TrainingMaterialID;
        this.product.ProductDescription = product[0].Result[0].ProductDescription;


        this.selectedanatomy = [];
        this.selecteddisease = [];
        this.selectedprocedure = [];
        this.selectedtrainingmeterial = [];

        if (product.AnatomyID != undefined) {
            this.selectedanatomy = product.AnatomyID.split(',').map(function (item) {
                return parseInt(item, 10);
            });
        }
        this.product.AnatomyID = this.selectedanatomy;
        if (product.DiseaseID != undefined) {
            this.selecteddisease = product.DiseaseID.substring(1, product.DiseaseID.length-1).split(',').map(function (item) {
                return parseInt(item, 10);
            });
        }
        this.product.DiseaseID = this.selecteddisease;


        if (product.ProcedureID != undefined) {
            this.selectedprocedure = product.ProcedureID.substring(1, product.ProcedureID.length-1).split(',').map(function (item) {
                return parseInt(item, 10);
            });
        }
        this.product.ProcedureID = this.selectedprocedure;

        //yourString.substring(1, yourString.length-1)
        if (product.TrainingMaterialID != undefined) {
            this.selectedtrainingmeterial = product.TrainingMaterialID.substring(1, product.TrainingMaterialID.length-1).split(',').map(function (item) {
                return parseInt(item, 10);
            });
        }
        this.product.TrainingMaterialID = this.selectedtrainingmeterial;
        





    }
    OnSourceChange(SourceValue) {
        console.log(SourceValue);
        const TrainingMeterialInputData = [];
        var myInput = {
            "UserID": sessionStorage.getItem('UserID'),
            "Device": "D",
            "TrainingSourceID": SourceValue
        };
        TrainingMeterialInputData.push(myInput);
        const TrainingMeterialInput = {
            "MethodName": "GetTrainingMaterial",
            "InputStr": TrainingMeterialInputData
        }
        console.log(JSON.stringify(TrainingMeterialInput));
        this._trainingsService.getData(TrainingMeterialInput).then((data) => {
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
                this.SourceTitleListItems = jsonobj2.Result;
            }
            else {

                this.SourceTitleListItems = [];
            }
        });
    }

}
