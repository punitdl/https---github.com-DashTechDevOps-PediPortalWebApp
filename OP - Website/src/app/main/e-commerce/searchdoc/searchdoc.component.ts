/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchdoc',
  templateUrl: './searchdoc.component.html',
  styleUrls: ['./searchdoc.component.scss']
})
export class SearchdocComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FuseUtils } from '@fuse/utils';
import { SearchdocService } from './searchdoc.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FilesDataSource } from 'app/main/trainings/training-list/training-list.component';
import { fuseAnimations } from '@fuse/animations';

//import { FaqService } from 'app/main/pages/faq/faq.service';

@Component({
  selector: 'app-searchdoc',
  templateUrl: './searchdoc.component.html',
  styleUrls: ['./searchdoc.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SearchdocComponent implements OnInit, OnDestroy
{
    faqs: any;
    faqsFiltered: any;
    step: number;
    searchInput: any;
    Searchresult: any ="ABC";
    selectedFilter: string = "-1";

    //Grid
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'categoryname', 'trainingname', 'nos', 'buttons'];
    

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FaqService} _faqService
     */
    constructor(
        private _faqService: SearchdocService,
        public matDialogRef: MatDialogRef<SearchdocComponent>,
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');
        this.step = 0;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._faqService.onFaqsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.faqs = response;
                this.faqsFiltered = response;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.faqsFiltered = FuseUtils.filterArrayByString(this.faqs, searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set step
     *
     * @param {number} index
     */
    setStep(index: number): void
    {
        this.step = index;
    }

    /**
     * Next step
     */
    nextStep(): void
    {
        this.step++;
    }

    /**
     * Previous step
     */
    prevStep(): void
    {
        this.step--;
    }

    GotoNext()
    {

    }

    GotoClose()
    {

    }
}

