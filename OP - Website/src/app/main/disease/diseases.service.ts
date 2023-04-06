import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Disease } from './disease.model';


@Injectable()
export class DiseasesService implements Resolve<any>
{
    onDiseasesChanged: BehaviorSubject<any>;
    onSelectedDiseasesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    diseases: Disease[];
    user: any;
    selectedDiseases: string[] = [];

    searchText: string;
    filterBy: string;

    Category: any[];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onDiseasesChanged = new BehaviorSubject([]);
        this.onSelectedDiseasesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getTrainings(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getTrainings();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getTrainings();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get diseases
     *
     * @returns {Promise<any>}
     */
    getTrainings(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/diseases-diseases')
                    .subscribe((response: any) => {

                        this.diseases = response;

                        if ( this.filterBy === 'starred' )
                        {
                            this.diseases = this.diseases.filter(_disease => {
                                return this.user.starred.includes(_disease.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.diseases = this.diseases.filter(_disease => {
                                return this.user.frequentTrainings.includes(_disease.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.diseases = FuseUtils.filterArrayByString(this.diseases, this.searchText);
                        }

                        this.diseases = this.diseases.map(disease => {
                            return new Disease(disease);
                        });

                        this.onDiseasesChanged.next(this.diseases);
                        resolve(this.diseases);
                    }, reject);
            }
        );
    }



    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/diseases-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected disease by id
     *
     * @param id
     */
    toggleSelectedDisease(id): void
    {
        // First, check if we already have that disease as selected...
        if ( this.selectedDiseases.length > 0 )
        {
            const index = this.selectedDiseases.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedDiseases.splice(index, 1);

                // Trigger the next event
                this.onSelectedDiseasesChanged.next(this.selectedDiseases);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedDiseases.push(id);

        // Trigger the next event
        this.onSelectedDiseasesChanged.next(this.selectedDiseases);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedDiseases.length > 0 )
        {
            this.deselectDiseases();
        }
        else
        {
            this.selectDiseases();
        }
    }

    /**
     * Select diseases
     *
     * @param filterParameter
     * @param filterValue
     */
    selectDiseases(filterParameter?, filterValue?): void
    {
        this.selectedDiseases = [];

        // If there is no filter, select all diseases
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedDiseases = [];
            this.diseases.map(disease => {
                this.selectedDiseases.push(disease.id);
            });
        }

        // Trigger the next event
        this.onSelectedDiseasesChanged.next(this.selectedDiseases);
    }

    /**
     * Update disease
     *
     * @param disease
     * @returns {Promise<any>}
     */
    updateTraining(disease): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/diseases-diseases/' + disease.id, {...disease})
                .subscribe(response => {
                    this.getTrainings();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/diseases-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getTrainings();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect diseases
     */
    deselectDiseases(): void
    {
        this.selectedDiseases = [];

        // Trigger the next event
        this.onSelectedDiseasesChanged.next(this.selectedDiseases);
    }

    /**
     * Delete disease
     *
     * @param disease
     */
    deleteTraining(disease): void
    {
        const trainingIndex = this.diseases.indexOf(disease);
        this.diseases.splice(trainingIndex, 1);
        this.onDiseasesChanged.next(this.diseases);
    }

    /**
     * Delete selected diseases
     */
    deleteSelectedTrainings(): void
    {
        for ( const trainingId of this.selectedDiseases )
        {
            const disease = this.diseases.find(_disease => {
                return _disease.id === trainingId;
            });
            const trainingIndex = this.diseases.indexOf(disease);
            this.diseases.splice(trainingIndex, 1);
        }
        this.onDiseasesChanged.next(this.diseases);
        this.deselectDiseases();
    }

}
