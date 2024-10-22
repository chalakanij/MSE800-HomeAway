import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateEmployeeData } from 'src/app/interface/employer.interface';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData, EmployeeByProjectData } from 'src/app/interface/project.interface';
import { EmployeeService } from 'src/app/services/employee-service/employee.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-view-project-employee',
  templateUrl: './view-project-employee.component.html',
  styleUrls: ['./view-project-employee.component.scss']
})
export class ViewProjectEmployeeComponent implements OnInit {

  projectDetailsGroup!: FormGroup;
  page!: Page<any>;
  pageEmployee!: Page<any>;
  title!: String;
  project!: Number;
  searchKey: String = "";
  projects!: CreateProjectData[];
  pageSize: number = 10;
  isInvalidForm!: boolean;
  selectedResults!: CreateEmployeeData[];
  selectedResultsByProject!: EmployeeByProjectData[];
  dataLength!: number;
  loading: boolean = false;
  displayedColumns: string[] = ['name', 'email'];
  selection = new SelectionModel<any>(true, []);
  filteredResults: CreateEmployeeData[] = [];
  originalResults: CreateEmployeeData[] = [];
  searchControl: FormControl = new FormControl('');

  constructor(
    private project_service: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ViewProjectEmployeeComponent>,
    private snackBar: MatSnackBar,
    private employee_service: EmployeeService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.data) {
      this.initializeForm();
      this.projectDetailsGroup.patchValue({
        title: this.data.data.title,
        description: this.data.data.description,
        status: this.data.data.status,
        id: this.data.data.id
      });
    }
    this.getEmployeeData("", 1, this.pageSize);
    this.getEmployeeByProjectData("", 1, this.pageSize);
    this.searchControl.valueChanges.subscribe(searchKey => {
      this.onSearch(searchKey);
    });
  }

  initializeForm() {
    if (this.data.type === 'VIEW_PROJECT_EMPLOYEE') {
      this.title = this.data.data.title + " Employee List";
    }
    console.log(this.data.data); 
    this.projectDetailsGroup = this.fb.group({
      title: ['']
    });
  }

  getEmployeeByProjectData(searchKey: String, pageIndex: number, pageSize: number) {
    this.project_service.getEmployeeByProjects(this.data.data.id, pageIndex, pageSize).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: Page<EmployeeByProjectData>) => { 
      console.log(res);
      this.loading = false;
      console.log(this.pageEmployee.items);
      // Ensure pageEmployee and its items are defined
      if (this.pageEmployee && this.pageEmployee.items) {
        if (res && res.items && res.items.length > 0) {
          this.page = res;
  
          // Cast the items to the correct type
          const employees = this.pageEmployee.items as CreateEmployeeData[];
          const items = res.items as EmployeeByProjectData[];
  
          // Filter employees based on matching employee_id
          const filteredEmployees: CreateEmployeeData[] = employees
            .filter((employee: CreateEmployeeData) => 
              items.some((item: EmployeeByProjectData) => item.employee_id === employee.id)
            );
  
          // Save filtered results
          this.originalResults = filteredEmployees;
          this.filteredResults = filteredEmployees;
          this.dataLength = this.page.total;
        } else {
          this.snackBar.open('No Employees found for this project', '', {
            duration: 2000,
          });
        }
      } else {
        this.snackBar.open('Employee data is not loaded', '', {
          duration: 2000,
        });
      }
    });
  }
  

  // setEmployeeByProjectData(content: any) {
  //   this.selectedResultsByProject = content;
  //   if (this.selectedResultsByProject?.length == 0 && this.searchKey != "") {
  //     this.snackBar.open('No Employee found', '', {
  //       duration: 2000,
  //     });
  //     this.getEmployeeByProjectData("", 1, this.pageSize);
  //   }
  // }

  onSearch(searchKey: string) {
    const searchKeyLower = searchKey.toLowerCase();
    this.filteredResults = this.originalResults.filter(
      item =>
        item.email.toLowerCase().includes(searchKeyLower) ||
        (item.title + ' ' + item.first_name + ' ' + item.last_name).toLowerCase().includes(searchKeyLower)
    );
  }

  toggleSelection(row: any) {
    this.selection.toggle(row);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredResults.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.filteredResults.forEach(row => this.selection.select(row));
  }

  isIndeterminate() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  // setEmployeeData(content: any) {
  //   this.selectedResults = content;
  //   if (this.selectedResults?.length == 0 && this.searchKey != "") {
  //     this.snackBar.open('No User found', '', {
  //       duration: 2000,
  //     });
  //     this.getEmployeeData("", 1, this.pageSize);
  //   }
  // }

  getEmployeeData(searchKey: String, pageIndex: number, pageSize: number) {
    this.employee_service.getEmployees(pageIndex, pageSize).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: Page<any>) => { 
      console.log(res);
      this.loading = false; 
    
      if (res && res.items && res.items.length > 0) {
        this.pageEmployee = res;
        // this.setEmployeeData(this.pageEmployee.items);
        this.dataLength = this.pageEmployee.total;
      } else {
        this.snackBar.open('No Employees found', '', {
          duration: 2000,
        });
      }
    });
  }
}
