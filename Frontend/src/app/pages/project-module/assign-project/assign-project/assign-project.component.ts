import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateEmployeeData } from 'src/app/interface/employer.interface';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { EmployeeService } from 'src/app/services/employee-service/employee.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-assign-project',
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.scss']
})
export class AssignProjectComponent implements OnInit {

  projectDetailsGroup!: FormGroup;
  page!: Page<any>;
  title!: String;
  project!: Number;
  searchKey: String = "";
  projects!: CreateProjectData[];
  pageSize: number = 10;
  isInvalidForm!: boolean;
  selectedResults!: CreateEmployeeData[];
  dataLength!: number;
  loading: boolean = false;
  displayedColumns: string[] = ['select', 'name', 'email'];
  selection = new SelectionModel<any>(true, []);
  filteredResults: any[] = [];
  originalResults: any[] = [];
  searchControl: FormControl = new FormControl('');

  constructor(
    private project_service: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AssignProjectComponent>,
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
        status: this.data.data.status
      });
    }
    this.getUserData("", 1, this.pageSize);
    this.searchControl.valueChanges.subscribe(searchKey => {
      this.onSearch(searchKey);
    });
  }

  initializeForm() {
    if (this.data.type === 'ASSIGN_PROJECT') {
      this.title = "Assign Employee";
    }
    console.log(this.data.data.title); 
    this.projectDetailsGroup = this.fb.group({
      title: ['']
    });
  }

  onSubmit(){

    if (this.projectDetailsGroup.invalid) {
      this.isInvalidForm = true;
      this.projectDetailsGroup.markAllAsTouched();
    } else {
      const request = {
        employee_id: this.selection.selected.map(user => user.id)
      }
      if (this.data.type === 'ASSIGN_PROJECT') {
        this.project_service.assignProject(request, this.data.data.id).subscribe(
          (response) => {
            console.log(response)
            if (response.error != true) {
              this.dialogRef.close(true);
              this.snackBar.open('Employees assigned to ' + this.projectDetailsGroup.value.title, '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open('Employees could not assigned to ' + this.projectDetailsGroup.value.title, '', {
                duration: 2000,
              });
            }
          },
          (error) => {
            this.dialogRef.close(false);
            this.snackBar.open('Employees could not assigned to '+ this.projectDetailsGroup.value.title, '', {
              duration: 2000,
            });
          }
        );
      }
    }
  }

  getUserData(searchKey: String, pageIndex: number, pageSize: number) {
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
        this.page = res;
        this.setUserData(this.page.items);
        this.dataLength = this.page.total;
        this.originalResults = res.items;
        this.filteredResults = res.items;
      } else {
        this.snackBar.open('No Employees found', '', {
          duration: 2000,
        });
      }
    });
  }

  setUserData(content: any) {
    this.selectedResults = content;
    if (this.selectedResults?.length == 0 && this.searchKey != "") {
      this.snackBar.open('No Employees found', '', {
        duration: 2000,
      });
      this.getUserData("", 1, this.pageSize);
    }
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
}