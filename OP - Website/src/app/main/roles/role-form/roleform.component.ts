import { Component, Inject, ViewEncapsulation, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { RolesService } from '../roles.service';
import { Role } from '../role.model';

//TreeView Code Start Here
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { AnyARecord } from 'dns';
import { TrainingsService } from 'app/main/trainings/trainings.service';

interface ModuleNode {
  ModuleID?: number;
  ModuleName: string;
  children?: ModuleNode[];
}

interface ExampleModuleNode {
  expandable: boolean;
  ModuleID: number;
  ModuleName: string;
  level: number;
}
//TreeView Code End Here

//TreeView Code Start Here
//TreeView Code End Here


@Component({
  selector: 'roles-role-form-dialog',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  //providers: [ChecklistDatabase]
})

export class RolesRoleFormDialogComponent {
  //TreeView Code Start Here
  TREE_DATA: ModuleNode[] = [];

  private _transformer = (node: ModuleNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      ModuleName: node.ModuleName,
      ModuleID: node.ModuleID,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleModuleNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  checklistSelection = new SelectionModel<ExampleModuleNode>(true /* multiple */);

  hasChild = (_: number, node: ExampleModuleNode) => node.expandable;
  getLevel = (node: ExampleModuleNode) => node.level;
  isExpandable = (node: ExampleModuleNode) => node.expandable;

  //getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasNoContent = (_: number, _nodeData: ExampleModuleNode) => _nodeData.ModuleName === '';

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: ExampleModuleNode): void {
    console.log(node);
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ExampleModuleNode): void {
    let parent: ExampleModuleNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: ExampleModuleNode): ExampleModuleNode | null {
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
  checkRootNodeSelection(node: ExampleModuleNode): void {
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
  descendantsAllSelected(node: ExampleModuleNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ExampleModuleNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ExampleModuleNode): void {


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
  todoItemSelection(node: ExampleModuleNode): void {
    //  console.log(node);
    this.checklistSelection.select(node);
  }
  GetTreeResult() {
    // console.log('success');
    // console.log(this.dataSource.data);
    // console.log(this.treeControl);
    // console.log(this.checklistSelection);
    // console.log(this.checklistSelection.selected);
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
      if (this.treeControl.dataNodes[i].ModuleID == 0) {
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    }
  }

  Nodecollapse() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].ModuleID == 0) {
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


      if (this.treeControl.dataNodes[i].ModuleID == 1) {
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
      "DesktopAccess": this.role.DesktopAccess
    };
    InputData.push(myInput);
    const CategoryKeywordInput = {
      "MethodName": "GetModule",
      "InputStr": InputData
    }

    // console.log(JSON.stringify(CategoryKeywordInput));
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

        this.TREE_DATA = this.convert(jsonobj2.Result);

        this.dataSource.data = this.TREE_DATA;
        var Newjson = this.role.Modules == undefined ? [] : (this.role.Modules.length != 0 ? JSON.parse(this.role.Modules.toString()) : []);
        if (Number(Newjson.length) > 0) {
          for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
            for (var s = 0; s < Newjson.length; s++) {
              if (this.treeControl.dataNodes[i].ModuleID == Newjson[s].ModuleID) {
                this.todoItemSelection(this.treeControl.dataNodes[i]);
                this.treeControl.expand(this.treeControl.dataNodes[i])
              }
            }
          }
        }
        //   console.log(this.dataSource.data);
      }
    });

  }


  convert(array) {
    var map = {};
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      obj.children = [];

      map[obj.ModuleID] = obj;

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
  role: Role;
  roleForm: FormGroup;
  dialogTitle: string;
  CategoryListItems: any;
  SourceListItems: any;


  ngOnInit() {

  }

  /**
   * Constructor
   *
   * @param {MatDialogRef<RolesRoleFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<RolesRoleFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _trainingsService: RolesService,
    private _trainingsServiceTree: TrainingsService,
    private _http: HttpClient
  ) {
    //TreeView Code Start Here
    this.dataSource.data = this.TREE_DATA;
    //TreeView Code End Here


    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Role';
      this.role = _data.role;
    }
    else {
      this.dialogTitle = 'New Role';
      this.role = new Role({});
      this.role.RoleID = null;

    }
    //TreeView Code End Here
    this.getdatfortreeview();
    //TreeView Code End Here
    this.roleForm = this.createRoleForm();


  }



  // getModules()
  // {
  //   this._trainingsService.getLoginCheck
  // }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create training form
   *
   * @returns {FormGroup}
   */
  createRoleForm(): FormGroup {
    return this._formBuilder.group({
      RoleID: [this.role.RoleID],
      RoleName: [this.role.RoleName],
      Freeze: [this.role.Freeze],
      keywords: [this.role.keywords],
      SelectedModule: [this.role.SelectedModule],
      RoleDescription: [this.role.RoleDescription],
      DesktopAccess: [this.role.DesktopAccess]
    });
  }

  saveRoles() {
    console.log(this.roleForm.value, this.checklistSelection.selected);
    this._trainingsService.updateRoles(this.roleForm.value, this.checklistSelection.selected);
  }
  DesktopAccessChange(event) {
    const InputData = [];
    var myInput = {
      "UserID": sessionStorage.getItem('UserID'),
      "Device": "D",
      "DesktopAccess": event.checked
    };
    InputData.push(myInput);
    const CategoryKeywordInput = {
      "MethodName": "GetModule",
      "InputStr": InputData
    }
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
        this.checklistSelection = new SelectionModel<ExampleModuleNode>(true /* multiple */);

        this.TREE_DATA = this.convert(jsonobj2.Result);

        this.dataSource.data = this.TREE_DATA;
        var Newjson = this.role.Modules == undefined ? [] : (this.role.Modules.length != 0 ? JSON.parse(this.role.Modules.toString()) : []);

        if (Number(Newjson.length) > 0) {
          for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
            for (var s = 0; s < Newjson.length; s++) {
              if (this.treeControl.dataNodes[i].ModuleID == Newjson[s].ModuleID) {
                this.todoItemSelection(this.treeControl.dataNodes[i]);
                this.treeControl.expand(this.treeControl.dataNodes[i])
              }
            }
          }
        }
        //   console.log(this.dataSource.data);
      }
    });

  }
}
