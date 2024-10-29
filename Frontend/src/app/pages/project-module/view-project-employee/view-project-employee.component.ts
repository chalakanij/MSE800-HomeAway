import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
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
  filteredResults: Object[] = [];
  assignedEmployees: Object[] = [];
  originalResults: CreateEmployeeData[] = [];
  searchControl: FormControl = new FormControl('');
  pageSizeOptions: number[] = [5, 10, 15, 20];

  constructor(
    private project_service: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ViewProjectEmployeeComponent>,
    private snackBar: MatSnackBar,
    private employee_service: EmployeeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {}

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
    this.getEmployeeData(1, 100)
    console.log("sss")
    this.getEmployeeByProjectData(1, this.pageSize);
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

  getEmployeeByProjectData(pageIndex: number, pageSize: number) {
    this.project_service.getEmployeeByProjects(this.data.data.id, pageIndex, pageSize).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: EmployeeByProjectData[]) => { 
      this.loading = false;
  
      if (res && res.length > 0) {
        const employees = this.filteredResults as CreateEmployeeData[] ;
        const filteredEmployees: CreateEmployeeData[] = employees
          .filter((employee: CreateEmployeeData) => 
            res.some((item: EmployeeByProjectData) => item.employee_id === employee.id)
          );
        
          console.log(filteredEmployees)
        if (filteredEmployees.length > 0) {
          this.originalResults = filteredEmployees;
          this.assignedEmployees = filteredEmployees;
        } else {
          this.snackBar.open('No matching employees found for this project', '', {
            duration: 2000,
          });
        }
      } else {
        this.snackBar.open('No Employees found for this project', '', {
          duration: 2000,
        });
      }
    });
  }
  
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

  getEmployeeData(pageIndex: number, pageSize: number) {
    this.employee_service.getEmployees(pageIndex, pageSize).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        this.loading = true;
        return throwError(error);
      })
    )
    .subscribe((res: Page<any>) => { 
      this.loading = true; 
      if (res && res.items && res.items.length > 0) {
        this.pageEmployee = res;
        this.filteredResults = res.items;
        this.dataLength = this.pageEmployee.total;
        this.cdr.detectChanges();
        this.loading = false;
      } else {
        this.snackBar.open('No Employees found', '', {
          duration: 2000,
        });
      }
    });
  }

  pageEvent(pageEvent: PageEvent) {
    if (pageEvent) {
      this.loading = true
    }
    this.getEmployeeByProjectData( pageEvent.pageIndex + 1, pageEvent.pageSize);
    return pageEvent;
  }

}
