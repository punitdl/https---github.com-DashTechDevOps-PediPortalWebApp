// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'sample2',
//   templateUrl: './sample2.component.html',
//   styleUrls: ['./sample2.component.scss']
// })
// export class Sample2Component implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { TrainingsService } from '../trainings/trainings.service';
import { AnyARecord } from 'dns';

interface FoodNode {
  id?: number;
  name: string;
  children?: FoodNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  id: number;
  name: string;
  level: number;
}

@Component({
  selector: 'sample2',
  templateUrl: './sample2.component.html',
  styleUrls: ['./sample2.component.scss']
})
export class Sample2Component implements OnInit {

  TREE_DATA: FoodNode[] = [{
    id: 0,
    name: 'ASDF'
  }];


  TREE_DATA_NEW: any;

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  checklistSelection = new SelectionModel<ExampleFlatNode>(true /* multiple */);

  constructor(private _trainingsService: TrainingsService,) {
    this.dataSource.data = this.TREE_DATA;
    //this.dataSource.data = this.TREE_DATA_NEW;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  getLevel = (node: ExampleFlatNode) => node.level;
  isExpandable = (node: ExampleFlatNode) => node.expandable;

  //getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasNoContent = (_: number, _nodeData: ExampleFlatNode) => _nodeData.name === '';

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

  GetTreeResult() {
    console.log('success');
    // console.log(this.dataSource.data);
    // console.log(this.treeControl);
    // console.log(this.checklistSelection);
    console.log(this.checklistSelection.selected);
  }
  GetTreeSelectAll() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (!this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      this.treeControl.expand(this.treeControl.dataNodes[i])
    }
  }
  GetTreeUnSelectAll() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      this.treeControl.collapse(this.treeControl.dataNodes[i])
    }
  }

  NodeExpand() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].id == 0) {
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
  }

  Nodecollapse() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].id == 0) {
        this.treeControl.collapse(this.treeControl.dataNodes[i])
      }
    }
  }

  NodeExpandAll() {
    this.treeControl.expandAll();
  }

  NodecollapseAll() {
    this.treeControl.collapseAll();
  }

  PrSelectedTreeview() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].id == 1) {
        this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
  }


  ngOnInit(): void {

    /*
    this.TREE_DATA = [
      {
        id: 0,
        name: 'Demo'
      },
      {
        id: 0,
        name: 'welcome screen',
        children: [
          { id: 12, name: 'Add' },
          { id: 13, name: 'Edit' },
          {
            id: 11, name: 'Mobile App',
            children: [
              { id: 111, name: 'Add' },
              { id: 112, name: 'Edit' }
            ]
          }
        ]
      },
      {
        id: 1,
        name: 'Fruit',
        children: [
          {
            id: 11, name: 'Apple',
            children: [
              { id: 111, name: 'gren' },
              { id: 112, name: 'red' }
            ]
          },
          { id: 12, name: 'Banana' },
          { id: 13, name: 'Fruit loops' },
        ]
      }, {
        id: 2, name: 'Vegetables',
        children: [
          {
            id: 22, name: 'Green',
            children: [
              { id: 222, name: 'Broccoli' },
              { id: 223, name: 'Brussels sprouts' },
            ]
          }, {
            id: 33, name: 'Orange',
            children: [
              { id: 333, name: 'Pumpkins' },
              { id: 334, name: 'Carrots' },
            ]
          },
        ]
      },
    ];
*/

    this.getdatfortreeview();
  }


  // MatChipCode start
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];

  add1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  // MatChipCode End

  getdatfortreeview() {
    const InputData = [];
    var myInput = {
      "UserID": "3",
      "Device": "D",
      "CategoryID": "1"
    };
    InputData.push(myInput);
    const CategoryKeywordInput = {
      "MethodName": "GetCategoryKeyword",
      "InputStr": InputData
    }

    this._trainingsService.getData(CategoryKeywordInput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        console.log(jsonobj2.Result);
        console.log(this.TREE_DATA);
        console.log(this.convert(jsonobj2.Result));
        this.TREE_DATA = this.convert(jsonobj2.Result);
        console.log(this.TREE_DATA);
        this.dataSource.data = this.TREE_DATA;
        console.log(this.dataSource.data);
      }
    });

  }


  convert(array) {
    var map = {};
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      obj.children = [];

      map[obj.id] = obj;

      var parent = obj.ParentID || '-';
      if (!map[parent]) {
        map[parent] = {
          children: []
        };
      }
      map[parent].children.push(obj);
    }
    //return map;
    return map['-'].children;

  }




}
export interface Fruit {
  name: string;
}



// return json format data
