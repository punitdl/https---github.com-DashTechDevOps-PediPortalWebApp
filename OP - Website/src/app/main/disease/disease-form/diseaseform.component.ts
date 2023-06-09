import { Component, Inject, ViewEncapsulation, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



import { HttpClient } from '@angular/common/http';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { Disease } from '../disease.model';
import { DiseasesService } from '../diseases.service';

interface FoodNode {
    name: string;
    children?: FoodNode[];
  }


  /** Flat node with expandable and level information */
interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
  }


  /**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
  }
  
  /**
   * The Json object for to-do list data.
   */

  
	
	
	

	
	
	
	



  const TREE_DATA = {
    Condition: {
      'limp': null,
      'Trauma': null,
      'systemic': null,
      Anatomic: {
        infection: null,
        deformity: ['Tumor', 'Tissue'],
        arithritis: null
      }
    },
    Reminders: [
      'Media Type',
      'Resarch'
    ]
  };
  
  /**
   * Checklist database, it can build a tree structured Json object.
   * Each node in Json object represents a to-do item or a category.
   * If a node is a category, it has children items and new items can be added under the category.
   */
  @Injectable()
  export class ChecklistDatabase {
    dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  
    get data(): TodoItemNode[] { return this.dataChange.value; }
  
    constructor() {
      this.initialize();
    }
  
    initialize() {
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      const data = this.buildFileTree(TREE_DATA, 0);
  
      // Notify the change.
      this.dataChange.next(data);
    }
  
    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
      return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
        const value = obj[key];
        const node = new TodoItemNode();
        node.item = key;
  
        if (value != null) {
          if (typeof value === 'object') {
            node.children = this.buildFileTree(value, level + 1);
          } else {
            node.item = value;
          }
        }
  
        return accumulator.concat(node);
      }, []);
    }
  
    /** Add an item to to-do list */
    insertItem(parent: TodoItemNode, name: string) {
      if (parent.children) {
        parent.children.push({item: name} as TodoItemNode);
        this.dataChange.next(this.data);
      }
    }
  
    updateItem(node: TodoItemNode, name: string) {
      node.item = name;
      this.dataChange.next(this.data);
    }
  }
  

@Component({
    selector     : 'disease-disease-form-dialog',
    templateUrl  : './disease-form.component.html',
    styleUrls    : ['./disease-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ChecklistDatabase]
})

export class DiseasesDiseaseFormDialogComponent
{
    action: string;
    disease: Disease;
    diseaseForm: FormGroup;
    dialogTitle: string;
    CategoryListItems: any;
    SourceListItems: any;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);


 
  

    /**
     * Constructor
     *
     * @param {MatDialogRef<DiseasesDiseaseFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<DiseasesDiseaseFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _diseasesService: DiseasesService,
        private _http: HttpClient,
        private _database: ChecklistDatabase
    )
    {
        _http.get<any[]>('api/diseases-categorydata').subscribe(result => {
            this.CategoryListItems = result;
            console.log(this.CategoryListItems);
          }, error => console.error(error)); 
          
          _http.get<any[]>('api/diseases-sourcedata').subscribe(result => {
            this.SourceListItems = result;
            console.log(this.SourceListItems);
          }, error => console.error(error)); 
          
        console.log(this.CategoryListItems);
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit disease';
            this.disease = _data.disease;
        }
        else
        {
            this.dialogTitle = 'New disease';
            this.disease = new Disease({});
        }

        this.diseaseForm = this.createDiseaseForm();

        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
          this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
          this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      
          _database.dataChange.subscribe(data => {
            this.dataSource.data = data;
          });
    }


    getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
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

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
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

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
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

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }

  nodeclick(nodedata)
  {
    console.log(nodedata)
    console.log(nodedata.TodoItemFlatNode);
    console.log(nodedata.item);
    //disease.addKeywordtree(nodedata.item,nodedata.item)
    //this.addNewItem(nodedata.item);
    
  }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create disease form
     *
     * @returns {FormGroup}
     */
    createDiseaseForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.disease.id],
            name    : [this.disease.name],
            lastName: [this.disease.lastName],
            avatar  : [this.disease.avatar],
            nickname: [this.disease.nickname],
            company : [this.disease.company],
            jobTitle: [this.disease.jobTitle],
            email   : [this.disease.email],
            phone   : [this.disease.phone],
            address : [this.disease.address],
            birthday: [this.disease.birthday],
            notes   : [this.disease.notes],
            categoryname   : [this.disease.categoryname],
            trainingname   : [this.disease.trainingname],
            nos   : [this.disease.nos],
            createdby   : [this.disease.createdby],
            createdon   : [this.disease.createdon],
            keywords      : [this.disease.keywords],
            categoryid      : [this.disease.categoryid],
        });
    }
}
