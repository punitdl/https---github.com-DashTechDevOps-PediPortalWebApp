
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { HttpClient } from '@angular/common/http';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';

interface FoodNode {
    name: string;
    children?: FoodNode[];
  }

  


  const TREE_DATA: FoodNode[] = [
    {
      name: 'Fruit',
      children: [
        {name: 'Apple',
        children:[
            {name:'gren'},
            {name:'red'}
        ]},
        {name: 'Banana'},
        {name: 'Fruit loops'},
      ]
    }, {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [
            {name: 'Broccoli'},
            {name: 'Brussels sprouts'},
          ]
        }, {
          name: 'Orange',
          children: [
            {name: 'Pumpkins'},
            {name: 'Carrots'},
          ]
        },
      ]
    },
  ];

  /** Flat node with expandable and level information */
interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }

@Component({
    selector   : 'sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})

export class SampleComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    errorMessage: string; 
    languages: any;
    EventsData: any;
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
    toppings = new FormControl();



    // Horizontal Stepper
    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;
    horizontalStepperStep3: FormGroup;

    // Vertical Stepper
    verticalStepperStep1: FormGroup;
    verticalStepperStep2: FormGroup;
    verticalStepperStep3: FormGroup;

    
    ngAfterViewInit() {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        if (this.treeControl.dataNodes[i].name == 'Fruit') {
          this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
          this.treeControl.expand(this.treeControl.dataNodes[i])
        }
        if (this.treeControl.dataNodes[i].name == 'Apple') {
          this.treeControl.expand(this.treeControl.dataNodes[i])
        }
      }
    }

    // Private
    private _unsubscribeAll: Subject<any>;

    private _transformer = (node: FoodNode, level: number) => {
        return {
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level: level,
        };
      }

      treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level, node => node.expandable);
  
    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);
  
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);
  

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        http: HttpClient
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
       
        http.get<any[]>('http://192.168.29.201/RlAPI/api/Event/GetAll').subscribe(result => {
            this.EventsData = result;
            console.log(this.EventsData);
          }, error => console.error(error));

          this.dataSource.data = TREE_DATA;
    }


    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    getLevel = (node: ExampleFlatNode) => node.level;
    isExpandable = (node: ExampleFlatNode) => node.expandable;

    //getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
    hasNoContent = (_: number, _nodeData: ExampleFlatNode) => _nodeData.name === '';


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Reactive Form
        this.form = this._formBuilder.group({
            company   : [
                {
                    value   : 'Google',
                    disabled: true
                }, Validators.required
            ],
            firstName : ['', Validators.required],
            lastName  : ['', Validators.required],
            address   : ['', Validators.required],
            address2  : ['', Validators.required],
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]],
            country   : ['', Validators.required],
            selecteddate :  ['', Validators.required],
            selecteddatetime : ['', Validators.required],
            togglevalue: [false],
            multiplecountry   : ['', Validators.required],
            toppings  : ['', Validators.required],
            options:  ['', Validators.required],
            selling_points: this._formBuilder.array(
                [this._formBuilder.group({point:'',qty : 0, status: "",eventid:""})]
                )
        });

       

        // Horizontal Stepper form steps
        this.horizontalStepperStep1 = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName : ['', Validators.required]
        });

        this.horizontalStepperStep2 = this._formBuilder.group({
            address: ['', Validators.required]
        });

        this.horizontalStepperStep3 = this._formBuilder.group({
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
        });

        // Vertical Stepper form stepper
        this.verticalStepperStep1 = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName : ['', Validators.required]
        });

        this.verticalStepperStep2 = this._formBuilder.group({
            address: ['', Validators.required]
        });

        this.verticalStepperStep3 = this._formBuilder.group({
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]]
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
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {
        alert('You have finished the horizontal stepper!');
    }

    /**
     * Finish the vertical stepper
     */
    finishVerticalStepper(): void
    {
        alert('You have finished the vertical stepper!');
    }

      get sellingPoints() {
        return this.form.get('selling_points') as FormArray;
      }

      /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
      todoLeafItemSelectionToggle(node: ExampleFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
      }

      /* Checks all the parents when a leaf node is selected/unselected */
      checkAllParentsSelection(node: ExampleFlatNode): void {
        let parent: ExampleFlatNode | null = this.getParentNode(node);
        while (parent) {
          this.checkRootNodeSelection(parent);
          parent = this.getParentNode(parent);
        }
      }

      /* Get the parent node of a node */
      getParentNode(node: ExampleFlatNode): ExampleFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
          return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
          const currentNode = this.treeControl.dataNodes[i];

          if (this.getLevel(currentNode) < currentLevel) {
            return currentNode;
          }
        }
        return null;
      }

      /** Check root node checked state and change it accordingly */
      checkRootNodeSelection(node: ExampleFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
          this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
          this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
          this.checklistSelection.select(node);
        }
      }

      /** Whether all the descendants of the node are selected. */
      descendantsAllSelected(node: ExampleFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
          this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
      }

      /** Whether part of the descendants are selected */
      descendantsPartiallySelected(node: ExampleFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
      }

      /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ExampleFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }


}


export class SellingPoint {
    selling_point: string;
    qty: number;
    status: string;
    eventid: number
}
