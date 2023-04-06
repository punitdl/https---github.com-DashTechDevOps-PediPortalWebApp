import { Component, OnInit } from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DataSource } from '@angular/cdk/collections';
import { ProductgridService } from './productgrid.service';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-productgrid',
  templateUrl: './productgrid.component.html',
  styleUrls: ['./productgrid.component.scss'],
  animations   : fuseAnimations
})
export class ProductgridComponent implements OnInit {

  searchInput: FormControl;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle', 'buttons'];
  selectedContacts: any[];
  checkboxes: {};
  dialogRef: any;
  hasSelectedContacts: boolean;

  contacts: any;
  user: any;

  // Private
  private _unsubscribeAll: Subject<any>;
    

  constructor(
    private _productgridService: ProductgridService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _fuseSidebarService: FuseSidebarService,
    private _matDialog: MatDialog
)
{
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    this.searchInput = new FormControl('');
}

  ngOnInit(): void {
    
    this.dataSource = new FilesDataSource(this._productgridService);

    this._productgridService.onContactsChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(contacts => {
        this.contacts = contacts;

        this.checkboxes = {};
        contacts.map(contact => {
            this.checkboxes[contact.id] = false;
        });
    });

    this._productgridService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedContacts.includes(id);
                }
                this.selectedContacts = selectedContacts;
            });

            this._productgridService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._productgridService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._productgridService.deselectContacts();
            });


    console.log(this.dataSource);
    this._productgridService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._productgridService.onSearchTextChanged.next(searchText);
            });
  }


  toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     */
    constructor(
        private _contactsService: ProductgridService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._contactsService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}

