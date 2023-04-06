import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ContactsService } from 'app/main/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/contacts/contact-form/contact-form.component';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContactsComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    department: any = [-1];
    ContactsListItems: any;
    ContactsFilter: string = "-1";
    DepartmentListItems: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _contactsService: ContactsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _http: HttpClient
    ) {
        // Set the defaults
        // Set the defaults
        const UserInputData = [];
        var myInput = { "UserID": sessionStorage.getItem('UserID'), Device: "D" };
        UserInputData.push(myInput);
        const Userinput = {
            "MethodName": "GetDepartment",
            "InputStr": UserInputData
        }

        this._contactsService.getDepartments(Userinput).then((data) => {

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
        //console.log(logininput);
        //  _http.get<any[]>('https://oplaunchapi.azurewebsites.net/api/OP/InvokeProcedure'+logininput).subscribe(result => {
        // _http.get<any[]>('api/common-departmentfilterlist').subscribe(result => {
        //   this.DepartmentListItems = result;
        //     console.log(this.DepartmentListItems);
        // }, error => console.error(error)); 

        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                // console.log(selectedContacts);
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._contactsService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New contact
     */
    newContact(): void {
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this._contactsService.updateContact(response.getRawValue());
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onDepartmentChanage(event: any) {

        this._contactsService.onDepartmentFilterChanged.next(this.department);
    }

}
