import { Component, Inject, ViewEncapsulation, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Training } from 'app/main/trainings/training.model';

import { HttpClient } from '@angular/common/http';


import { BehaviorSubject } from 'rxjs';


//TreeView Code Start Here
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { AnyARecord } from 'dns';
import { TrainingsService } from 'app/main/trainings/trainings.service';

interface KeywordNode {
  KeyWordID?: number;
  Name: string;
  children?: KeywordNode[];
}

interface ExampleKeywordNode {
  expandable: boolean;
  KeyWordID: number;
  Name: string;
  level: number;
}
//TreeView Code End Here

//TreeView Code Start Here
//TreeView Code End Here


@Component({
  selector: 'trainings-training-form-dialog',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // providers: [ChecklistDatabase]
})

export class TrainingsTrainingFormDialogComponent {
  //TreeView Code Start Here
  TREE_DATA: KeywordNode[] = [];

  private _transformer = (node: KeywordNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      Name: node.Name,
      KeyWordID: node.KeyWordID,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleKeywordNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  checklistSelection = new SelectionModel<ExampleKeywordNode>(true /* multiple */);

  hasChild = (_: number, node: ExampleKeywordNode) => node.expandable;
  getLevel = (node: ExampleKeywordNode) => node.level;
  isExpandable = (node: ExampleKeywordNode) => node.expandable;

  //getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasNoContent = (_: number, _nodeData: ExampleKeywordNode) => _nodeData.Name === '';

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: ExampleKeywordNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ExampleKeywordNode): void {
    let parent: ExampleKeywordNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: ExampleKeywordNode): ExampleKeywordNode | null {
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
  checkRootNodeSelection(node: ExampleKeywordNode): void {
    ////console.log(node);
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
  descendantsAllSelected(node: ExampleKeywordNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ExampleKeywordNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ExampleKeywordNode): void {

    ////console.log(node);

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

  todoItemSelection(node: ExampleKeywordNode): void {
    ////console.log(node);
    this.checklistSelection.select(node);
  }

  GetTreeResult() {
    //console.log('success');
    // //console.log(this.dataSource.data);
    // //console.log(this.treeControl);
    // //console.log(this.checklistSelection);
    //console.log(this.checklistSelection.selected);
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
      if (this.treeControl.dataNodes[i].KeyWordID == 0) {
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
  }

  Nodecollapse() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].KeyWordID == 0) {
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
      if (this.treeControl.dataNodes[i].KeyWordID == 1) {
        this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
  }

  getdatfortreeview() {
    const InputData = [];
    var myInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D",
      "CategoryID": this.training.CategoryID
    };
    InputData.push(myInput);
    const CategoryKeywordInput = {
      "MethodName": "GetCategoryKeyword",
      "InputStr": InputData
    }
    if (InputData[0].UserID && InputData[0].CategoryID) {
      this._trainingsServiceTree.getData(CategoryKeywordInput).then((data) => {
        // console.log(data);
        var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        var jsonobj1 = JSON.parse(myObjStr1);
        if (jsonobj1.Result[0]["ErrorID"] > 0) {
          var jsonStr2 = "";
          for (let i = 0; i < data["Table1"].length; i++) {
            jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
          }
          var jsonobj2 = JSON.parse(jsonStr2);
          //  console.log(jsonobj2.Result);
          //  console.log(this.TREE_DATA);
          console.log(this.convert(jsonobj2.Result));
          this.TREE_DATA = this.convert(jsonobj2.Result);
          //  console.log(this.TREE_DATA);
          this.dataSource.data = this.TREE_DATA;
          console.log(this.training.CategoryKeywords);
          var Newjson;
          if (typeof (this.training.CategoryKeywords) == 'object') {
            Newjson = this.training.CategoryKeywords;
          }
          else if (typeof (this.training.CategoryKeywords) == 'string') {
            Newjson = JSON.parse(this.training.CategoryKeywords);
          }
          else {
            Newjson = [];
          }
          if (Number(Newjson.length) > 0) {
            //console.log(Newjson.length);
            //console.log(this.treeControl.dataNodes.length);
            for (let i = 0; i < this.treeControl.dataNodes.length; i++) {

              for (var s = 0; s < Newjson.length; s++) {
                //console.log(this.treeControl.dataNodes[i].KeyWordID);
                //console.log(Newjson[s].KeywordID);
                if (this.treeControl.dataNodes[i].KeyWordID == Number(Newjson[s].KeywordID)) {

                  //console.log(this.treeControl.dataNodes[i]);
                  this.todoItemSelection(this.treeControl.dataNodes[i]);
                  this.treeControl.expand(this.treeControl.dataNodes[i])
                }
              }
            }
          }
        }
      });
    }
  }


  convert(array) {
    var map = {};
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      obj.children = [];

      map[obj.KeyWordID] = obj;

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

  //TreeView Code End Here
  action: string;
  training: Training;
  trainingForm: FormGroup;
  dialogTitle: string;
  CategoryListItems: any;
  SourceListItems: any;
  KeywordListItems: any;
  keywords: [];
  // MatChipCode start
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  ManualKeyword: any[] = [];

  add1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.ManualKeyword.push({ Keyword: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove1(manualkeyword: any): void {
    const index = this.ManualKeyword.indexOf(manualkeyword);

    if (index >= 0) {
      this.ManualKeyword.splice(index, 1);
    }

    this.training.Keywords = JSON.parse(this.ManualKeyword.toString());
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      //console.log(typeof(this.training.Keywords));
      if (typeof (this.training.Keywords) == 'undefined') {
        this.training.Keywords = [];
      }
      this.training.Keywords.push({ Keyword: value.trim() });
      //; a.push(mynewvalue);
    }
    //console.log(this.training.Keywords);
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(manualkeyword: any): void {
    const index = this.training.Keywords.indexOf(manualkeyword);

    if (index >= 0) {
      this.training.Keywords.splice(index, 1);
    }
  }

  // MatChipCode End

  ngOnInit() {

  }


  /**
   * Constructor
   *
   * @param {MatDialogRef<TrainingsTrainingFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<TrainingsTrainingFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _trainingsService: TrainingsService,
    private _http: HttpClient,
    private _trainingsServiceTree: TrainingsService,
    // private _database: ChecklistDatabase
  ) {
    //TreeView Code Start Here
    this.dataSource.data = this.TREE_DATA;
    //TreeView Code End Here

    const TrainingSourceInputData = [];
    var myInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    TrainingSourceInputData.push(myInput);
    const TrainingSourceInput = {
      "MethodName": "GetTrainingSource",
      "InputStr": TrainingSourceInputData
    }

    this._trainingsService.getData(TrainingSourceInput).then((data) => {
      // console.log(data);
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

    const CategoriesInputData = [];
    var CategoryInput = { "UserID": sessionStorage.getItem('UserID'), "Device": "D" };
    CategoriesInputData.push(CategoryInput);
    const CategoriesInput = {
      "MethodName": "GetCategory",
      "InputStr": CategoriesInputData
    }

    this._trainingsService.getData(CategoriesInput).then((data) => {
      // console.log(data);
      var myObjStr1 = data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      var jsonobj1 = JSON.parse(myObjStr1);
      if (jsonobj1.Result[0]["ErrorID"] > 0) {
        var jsonStr2 = "";
        for (let i = 0; i < data["Table1"].length; i++) {
          jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
        }
        var jsonobj2 = JSON.parse(jsonStr2);
        //console.log(jsonobj2);
        this.CategoryListItems = jsonobj2.Result;
      }
    });

    // const KeywordInputData=[];
    // var KeyInput = { "UserID":sessionStorage.getItem('UserID'),"Device": "D",};
    // KeywordInputData.push(KeyInput);
    // const KeywordInput={
    //     "MethodName" : "GetCategoryKeyword",
    //     "InputStr" :  KeywordInputData
    //     }             

    //     this._trainingsService.getData(KeywordInput).then((data) => {
    //        // console.log(data);
    //         var myObjStr1= data.Table[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
    //         var jsonobj1 = JSON.parse(myObjStr1);
    //         if (jsonobj1.Result[0]["ErrorID"] > 0)
    //         {
    //           var jsonStr2 ="";                 
    //           for (let i = 0; i < data["Table1"].length; i++) {
    //             jsonStr2 += data["Table1"][i]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"] ;
    //           }
    //           var jsonobj2 = JSON.parse(jsonStr2);
    //           //console.log(jsonobj2);
    //           this.KeywordListItems=jsonobj2.Result;                 
    //     }
    //     }); 

    // _http.get<any[]>('api/trainings-categorydata').subscribe(result => {
    //     this.CategoryListItems = result;
    //     console.log(this.CategoryListItems);
    //   }, error => console.error(error)); 

    // _http.get<any[]>('api/trainings-sourcedata').subscribe(result => {
    //   this.SourceListItems = result;
    //   console.log(this.SourceListItems);
    // }, error => console.error(error)); 

    // console.log(this.CategoryListItems);
    // Set the defaults
    this.action = _data.action;


    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Training';
      this.training = _data.training;

      // console.log(_data.training.KeywordsNew1);
      // console.log(JSON.stringify(this.training));

      //this.training.K
      // console.log(this.training.KeywordsNew1);
      // console.log(JSON.stringify(this.training.Keywords).replace('{','').replace('}',''));
      //console.log([{"Keywords":" test"},{"Keywords":"123"}].toString().replace('{','').replace('}',''));


      //this.training.Keywords = 
      // console.log (this.training);
      // console.log(this.training.Keywords);
      // var NewJson1 = JSON.parse(this.training.Keywords.toString());
      // const usersJson: String[] = Array.of(NewJson1);
      // console.log(Array.of(NewJson1))
      // this.training.Keywords = usersJson;
      if (typeof (this.training.Keywords) == "string") {
        this.training.Keywords = JSON.parse(this.training.Keywords);
      }
      //  console.log(this.training.Keywords);
      //  console.log(typeof(this.training.Keywords));
      //  console.log(JSON.parse(this.training.Keywords.toString()));
      //  console.log(JSON.stringify(this.ManualKeyword));
      //this.training.Keywords=[" test", "123"];
      //this.training.Keywords= this.ManualKeyword;
      // console.log(this.training.Keywords.toString());
      // =["test","test1"];
    }
    else {
      this.dialogTitle = 'New Training';
      this.training = new Training({});
      this.training.TrainingMaterialID = null;
    }
    //TreeView Code End Here
    this.getdatfortreeview();
    //TreeView Code End Here

    this.trainingForm = this.createTrainingForm();

  }
  onCategoryChange(event: any) {
    this.training.CategoryID = event.value;
    this.getdatfortreeview();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create training form
   *
   * @returns {FormGroup}
   */
  createTrainingForm(): FormGroup {
    return this._formBuilder.group({
      TrainingMaterialID: [this.training.TrainingMaterialID],
      TrainingSourceID: [this.training.TrainingSourceID],
      TrainingSourceName: [this.training.TrainingSourceName],
      TrainingMaterialName: [this.training.TrainingMaterialName],
      LinkURL: [this.training.LinkURL],
      CategoryID: [this.training.CategoryID],
      CategoryKeywords: [this.training.CategoryKeywords],
      Keywords: [this.training.Keywords]
    });
  }

  saveTrainings() {
    //console.log(this.trainingForm.value);
    ////console.log(this.training);
    this._trainingsService.updateTraining(this.trainingForm.value, this.checklistSelection.selected);
  }
  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     this.keywords.push({name: value.trim()});
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

}
