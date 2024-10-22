import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { StateService } from 'src/app/services/common-service/state-service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { DeleteDialogComponent } from 'src/app/shared-components/delete-dialog/delete-dialog.component';
import { AddProjectComponent } from '../../add-project/add-project/add-project.component';
import { AssignProjectComponent } from '../../assign-project/assign-project/assign-project.component';
import { EditProjectComponent } from '../../edit-project/edit-project/edit-project.component';
import { ViewProjectEmployeeComponent } from '../../view-project-employee/view-project-employee.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  panelOpenState = false;
  dataLength!: number;
  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  searchForm!: FormGroup;
  selectedResults!: CreateProjectData[];
  searchKey: String = "";
  page!: Page<any>;
  loading: boolean = false;
  projects: String = 'no';
  isEmployer: String = 'employee';

  selection = new SelectionModel<CreateProjectData>(true, []);

  constructor(
    public dialog: MatDialog,
    private project_service: ProjectService,
    private snackBar: MatSnackBar,
    private data: StateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isEmployerRole();
    this.data.changeTitle("Projects");
    this.projects = 'projects';
    this.searchForm = new FormGroup({
      searchBy: new FormControl(null, [Validators.required]),
    });
    this.loading = true;
    this.pageSize = 10;
    this.getProjectData(this.searchKey, 1, this.pageSize);
  }

  setProjectData(content: any) {
    this.selectedResults = content;
    if (this.selectedResults?.length == 0 && this.searchKey != "") {
      this.snackBar.open('No User found', '', {
        duration: 2000,
      });
      this.getProjectData("", 1, this.pageSize);
    }
  }

  getProjectData(searchKey: String, pageIndex: number, pageSize: number) {
    this.project_service.getProjects(pageIndex, pageSize).pipe(
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
        this.setProjectData(this.page.items);
        this.dataLength = this.page.total;
      } else {
        this.snackBar.open('No Users found', '', {
          duration: 2000,
        });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      data: {
        type: 'CREATE_PROJECT',
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.loading = true;
        this.pageSize = 10;
        this.getProjectData(this.searchKey, 1, this.pageSize);
      }
    });
  }

  onEditDialog(project: CreateProjectData) {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      data: {
        type: 'EDIT_PROJECT',
        message: "",
        data: project
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.loading = true;
        this.pageSize = 10;
        this.getProjectData(this.searchKey, 1, this.pageSize);
      }
    });
  }

  openDeleteDialog(project: CreateProjectData) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message: project.title + ' will be deleted permanently.',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.project_service.deleteProject([project.id]).subscribe((res: { error: any; }) => {
          if (!res.error) {
            this.snackBar.open(project.title + ' deleted', '', {
              duration: 2000,
            });
            this.loading = true;
            this.pageSize = 10;
            this.getProjectData(this.searchKey, 1, this.pageSize);
          }
        });
      }

    });
  }

  openBulkDeleteDialog() {

    let deleteProjects = this.selection.selected;
    let deleteUnits: Number[] = [];
    deleteProjects.forEach(project => {
      deleteUnits.push(project.id);
    });

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message: deleteUnits.join(', ') + ' will be deleted permanently.',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        },
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.project_service.deleteProject(deleteUnits).subscribe((res) => {
          if (!res.error) {
            this.snackBar.open(deleteUnits.join(", ") + ' deleted', '', {
              duration: 2000,
            });
            this.loading = true;
            this.pageSize = 10;
            this.getProjectData(this.searchKey, 1, this.pageSize);
            this.selection.clear();
          }
        });
      }
    });
  }

  onSearch(searchKey: String) {
    this.searchKey = searchKey;
    this.loading = true;
    this.getProjectData(this.searchKey, 1, this.pageSize);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.page?.size;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.selectedResults);
  }

  checkboxLabel(row?: CreateProjectData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }

  pageEvent(pageEvent: PageEvent) {
    if (pageEvent) {
      this.loading = true
    }
    this.getProjectData(this.searchKey, pageEvent.pageIndex, pageEvent.pageSize);
    return pageEvent;
  }

  isEmployerRole() {
    if (this.authService.getRoles().includes('EMPLOYER')) {
      this.isEmployer = 'employer';
    } else if (this.authService.getRoles().includes('SUPER_ADMIN')) {
      this.isEmployer = 'admin';
    } else {
      this.isEmployer = 'employee'
    }
  }

  onClickAssignDialog(projectData: CreateProjectData) {
    const dialogRef = this.dialog.open(AssignProjectComponent, {
      data: {
        type: "ASSIGN_PROJECT",
        data: projectData
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.loading = true;
      this.pageSize = 10;
      this.getProjectData(this.searchKey, 1, this.pageSize);
    });
  }

  onClickViewEmployeeDialog(projectData: CreateProjectData) {
    const dialogRef = this.dialog.open(ViewProjectEmployeeComponent, {
      data: {
        type: "VIEW_PROJECT_EMPLOYEE",
        data: projectData
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      this.loading = true;
      this.pageSize = 10;
      this.getProjectData(this.searchKey, 1, this.pageSize);
    });
  }
}