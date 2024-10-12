import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Page } from 'src/app/interface/paginator/page';
import { DeleteDialogComponent } from 'src/app/shared-components/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from 'src/app/services/common-service/state-service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { CreateEmployeeData } from 'src/app/interface/employer.interface';
import { EmployeeService } from 'src/app/services/employee-service/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  panelOpenState = false;
  dataLength!: number;
  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  searchForm!: FormGroup;
  selectedResults!: CreateEmployeeData[];
  searchKey: String = "";
  page!: Page<any>;
  loading: boolean = false;
  transfer!: 'no';
  isAdmin: String = 'user';

  selection = new SelectionModel<CreateEmployeeData>(true, []);

  constructor(
    public dialog: MatDialog,
    private employee_service: EmployeeService,
    private snackBar: MatSnackBar,
    private data: StateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.isAdminRole();
    this.data.changeTitle("Employees");
    this.searchForm = new FormGroup({
      searchBy: new FormControl(null, [Validators.required]),
    });
    this.loading = true;
    this.pageSize = 10;
    this.getUserData(this.searchKey, 0, this.pageSize);
  }

  setUserData(content: any) {
    this.selectedResults = content;
    if (this.selectedResults?.length == 0 && this.searchKey != "") {
      this.snackBar.open('No User found', '', {
        duration: 2000,
      });
      this.getUserData("", 0, this.pageSize);
    }
  }

  getUserData(searchKey: String, pageIndex: number, pageSize: number) {
    this.employee_service.getEmployees(searchKey, pageIndex, pageSize).subscribe((res: { error: any; body: any; }) => {
      if (!res.error) {
        this.page = res.body;
        this.setUserData(this.page.content);
        this.dataLength = this.page.totalElements;
        this.loading = false;
      } else {
        this.snackBar.open('No Users found', '', {
          duration: 2000,
        });
        this.loading = false;
      }
    });
  }

  openCreateDialog() {
    // const dialogRef = this.dialog.open(CreateUserComponent, {
    //   data: {
    //     type: UserDialogBoxEnum.CREATE_USER,
    //   }
    // });
    // dialogRef.afterClosed().subscribe((confirmed) => {
    //   if (confirmed) {
    //     this.loading = true;
    //     this.pageSize = 10;
    //     this.getUserData(this.searchKey, 0, this.pageSize);
    //   }
    // });
  }

  // onEditDialog(user: CreateEmployerData) {
  //   const dialogRef = this.dialog.open(CreateUserComponent, {
  //     data: {
  //       type: UserDialogBoxEnum.EDIT_USER,
  //       message: "",
  //       data: user
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((confirmed) => {
  //     if (confirmed) {
  //       this.loading = true;
  //       this.pageSize = 10;
  //       this.getUserData(this.searchKey, 0, this.pageSize);
  //     }
  //   });
  // }

  openDeleteDialog(user: CreateEmployeeData) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        message: user.email + ' will be deleted permanently.',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.employee_service.deleteEmployee([user.email]).subscribe((res: { error: any; }) => {
          if (!res.error) {
            this.snackBar.open(user.email + ' deleted', '', {
              duration: 2000,
            });
            this.loading = true;
            this.pageSize = 10;
            this.getUserData(this.searchKey, 0, this.pageSize);
          }
        });
      }

    });
  }

  openBulkDeleteDialog() {

    let deleteUsers = this.selection.selected;
    let deleteUnits: String[] = [];
    deleteUsers.forEach(user => {
      deleteUnits.push(user.email);
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
        this.employee_service.deleteEmployee(deleteUnits).subscribe((res) => {
          if (!res.error) {
            this.snackBar.open(deleteUnits.join(", ") + ' deleted', '', {
              duration: 2000,
            });
            this.loading = true;
            this.pageSize = 10;
            this.getUserData(this.searchKey, 0, this.pageSize);
            this.selection.clear();
          }
        });
      }
    });
  }

  onSearch(searchKey: String) {
    this.searchKey = searchKey;
    this.loading = true;
    this.getUserData(this.searchKey, 0, this.pageSize);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.page?.numberOfElements;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.selectedResults);
  }

  checkboxLabel(row?: CreateEmployeeData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.first_name + 1}`;
  }

  pageEvent(pageEvent: PageEvent) {
    if (pageEvent) {
      this.loading = true
    }
    this.getUserData(this.searchKey, pageEvent.pageIndex, pageEvent.pageSize);
    return pageEvent;
  }

  // isAdminRole() {
  //   if (this.authService.getRoles().includes('ROLE_ADMIN')) {
  //     this.isAdmin = 'admin';
  //   } else {
  //     this.isAdmin = 'user';
  //   }
  // }
}
