import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from 'src/app/interface/paginator/page';
import { CreateTimeLogData } from 'src/app/interface/time-log.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { StateService } from 'src/app/services/common-service/state-service';
import { TimeLogService } from 'src/app/services/time-log-service/time-log.service';
import { AddTimeLogsComponent } from '../../add-time-logs/add-time-logs/add-time-logs.component';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { ProjectService } from 'src/app/services/project-service/project.service';
import * as moment from 'moment';
import { CreateEmployeeData } from 'src/app/interface/employer.interface';
import { EmployeeService } from 'src/app/services/employee-service/employee.service';

@Component({
  selector: 'app-time-logs',
  templateUrl: './time-logs.component.html',
  styleUrls: ['./time-logs.component.scss']
})
export class TimeLogsComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  panelOpenState = false;
  dataLength!: number;
  pageSize!: number;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  searchForm!: FormGroup;
  selectedResults: CreateTimeLogData[] = [];
  selectedProjects: CreateProjectData[] = [];
  selectedEmployees: CreateEmployeeData[] = [];
  searchKey: String = "";
  page!: Page<any>;
  loading: boolean = false;
  timeLogs: String = 'no';
  isEmployer: String = 'employee';
  projectId = undefined;
  employeeId = undefined;
  selectedResultsWithTitles!: any;

  selection = new SelectionModel<CreateTimeLogData>(true, []);

  constructor(
    public dialog: MatDialog,
    private time_log_service: TimeLogService,
    private snackBar: MatSnackBar,
    private data: StateService,
    private authService: AuthService,
    private project_service: ProjectService,
    private employee_service: EmployeeService
  ) { }

  ngOnInit(): void {
    this.isEmployerRole();
    this.data.changeTitle("Time Logs");
    this.timeLogs = 'timeLogs';
    this.searchForm = new FormGroup({
      searchBy: new FormControl(null, [Validators.required]),
    });
    this.loading = true;
    this.pageSize = 10;
    if (this.isEmployer == 'employer') {
      this.getProjectData(1, 100);
      this.getUserData(1, 100);
      this.getTimeLogData(1, this.pageSize, undefined, undefined);
    } else {
      this.getTimeLogData(1, this.pageSize, this.authService.getUserId(), undefined);
    }
  }

  setTimeLogData(content: any) {
    this.selectedResults = content;
    if (this.selectedResults?.length == 0) {
      this.snackBar.open('No Time Logs found', '', {
        duration: 2000,
      });
      if (this.isEmployer == 'employer') {
        this.getTimeLogData(1, this.pageSize, undefined, undefined);
      } else {
        this.getTimeLogData(1, this.pageSize, this.authService.getUserId(), undefined);
      }
    } else {
      this.selectedResultsWithTitles = this.selectedResults.map(timeLog => {
        const project = this.selectedProjects.find(project => project.id === timeLog.project_id);
        return {
          ...timeLog,
          projectTitle: project ? project.title : undefined,
          formattedInTime: moment(timeLog.in_time).format('YYYY-MM-DD HH:mm:ss'),
          formattedOutTime: timeLog.out_time ? moment(timeLog.out_time).format('YYYY-MM-DD HH:mm:ss') : ''
        };
      });
    }
  }

  getTimeLogData(pageIndex: number, pageSize: number, user_id: any, project_id:any) {
    this.time_log_service.getTimeLogs(pageIndex, pageSize, user_id, project_id).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        this.loading = false;
        return throwError(error);
      })
    )
      .subscribe((res: Page<any>) => {
        this.loading = false;
        console.log(res)
        if (res && res.items && res.items.length > 0) {
          this.page = res;
          this.setTimeLogData(this.page.items);
          this.dataLength = this.page.total;
        } else {
          this.snackBar.open('No Time Logs found', '', {
            duration: 2000,
          });
          this.selectedResultsWithTitles = [];
        }
      });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AddTimeLogsComponent, {
      data: {
        type: 'CREATE_TIMELOG',
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.loading = true;
        this.pageSize = 10;
        this.selectedResultsWithTitles = [];
        if (this.isEmployer == 'employer') {
          this.getTimeLogData(1, this.pageSize, undefined, undefined);
        } else {
          this.getTimeLogData(1, this.pageSize, this.authService.getUserId(), undefined);
        }
      }
    });
  }

  pageEvent(pageEvent: PageEvent) {
    if (pageEvent) {
      this.loading = true
    }
    if (this.isEmployer == 'employer') {
      this.getTimeLogData(pageEvent.pageIndex + 1, pageEvent.pageSize, undefined, undefined);
    } else {
      this.getTimeLogData(pageEvent.pageIndex + 1, pageEvent.pageSize, this.authService.getUserId(), undefined);
    }
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

  setProjectData(content: any) {
    this.selectedProjects = content;
    console.log(this.selectedProjects)
    if (this.selectedProjects?.length == 0) {
      this.snackBar.open('No Projects found', '', {
        duration: 2000,
      });
    }
  }

  getProjectData(pageIndex: number, pageSize: number) {
    this.project_service.getProjects(pageIndex, pageSize).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        return throwError(error);
      })
    )
      .subscribe((res: Page<any>) => {
        if (res && res.items && res.items.length > 0) {
          this.setProjectData(res.items);
        } else {
          this.snackBar.open('No Projects found', '', {
            duration: 2000,
          });
        }
      });
  }

  setUserData(content: any) {
    this.selectedEmployees = content;
    if (this.selectedEmployees?.length == 0) {
      this.snackBar.open('No User found', '', {
        duration: 2000,
      });
    }
  }

  getUserData(pageIndex: number, pageSize: number) {
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
        this.setUserData(res.items);
      } else {
        this.snackBar.open('No Users found', '', {
          duration: 2000,
        });
      }
    });
  }

  onSearchProjects(event: any) {
    this.loading = true;
    this.projectId = event
    this.getTimeLogData(1, this.pageSize, this.employeeId , event);
  }

  onSearchEmployees(event: any) {
    this.loading = true;
    this.employeeId = event
    this.getTimeLogData(1, this.pageSize, event, this.projectId );
  }
}
