import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData, EmployeeByProjectData } from 'src/app/interface/project.interface';
import { CreateTimeLogData } from 'src/app/interface/time-log.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { TimeLogService } from 'src/app/services/time-log-service/time-log.service';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-add-time-logs',
  templateUrl: './add-time-logs.component.html',
  styleUrls: ['./add-time-logs.component.scss']
})
export class AddTimeLogsComponent implements OnInit {

  timeLogDetailsGroup!: FormGroup;
  page!: Page<any>;
  title!: String;
  project!: Number;
  headLbl!: String;
  searchKey: String = "";
  pageSize: number = 10;
  isInvalidForm!: boolean;
  projects!: CreateProjectData[];
  maxDate: Date = new Date();
  timeLogData!: CreateTimeLogData;
  selectedProject: any;

  constructor(
    private time_log_service: TimeLogService,
    private project_service: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddTimeLogsComponent>,
    private snackBar: MatSnackBar,
    private auth_service: AuthService

  ) {
  }

  ngOnInit(): void {
    this.timeLogDetailsGroup = new FormGroup({
      project: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      in_time: new FormControl(['', Validators.required]),
      in_date: new FormControl(['', Validators.required]),
      out_time: new FormControl(['']),
      out_date: new FormControl(['']),
    });
    this.getProjectsByUser().then(() => {
      if (this.data.type === 'CREATE_TIMELOG') {
        this.title = "Create Time Log";
      } else if (this.data.type === 'EDIT_TIMELOG') {
        this.title = "Update Time Log";
        this.timeLogData = this.data.data;
        this.setEditTimeLogData();
      }
    });
  }

  onSubmit() {

    const requiredFields = ['project', 'description', 'in_date', 'in_time'];
    this.isInvalidForm = requiredFields.some(field =>
      this.timeLogDetailsGroup.get(field)?.invalid
    );

    if (this.isInvalidForm) {
      this.isInvalidForm = true;
      this.timeLogDetailsGroup.markAllAsTouched();
    } else {
      const inDate = this.timeLogDetailsGroup.value.in_date;
      const inTime = this.timeLogDetailsGroup.value.in_time;
      const outDate = this.timeLogDetailsGroup.value.out_date;
      const outTime = this.timeLogDetailsGroup.value.out_time;

      const inTimeISO = inDate && inTime ? this.parseDate(inDate, inTime) : null;
      const outTimeISO = outDate && outTime ? this.parseDate(outDate, outTime) : null;
  
      let request: any = {
        project_id: this.timeLogDetailsGroup.value.project? this.timeLogDetailsGroup.value.project.id : this.selectedProject.id,
        description: this.timeLogDetailsGroup.value.description,
        in_time: inTimeISO,
      };

      if (outTimeISO) {
        request.out_time = outTimeISO;
      }
      if (this.data.type === 'CREATE_TIMELOG') {
        this.time_log_service.createTimeLogCheckin(request).subscribe(
          (response) => {
            console.log(response)
            if (response.error != true) {
              this.dialogRef.close(true);
              this.snackBar.open('New time log added to .', '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open('Time log not added.', '', {
                duration: 2000,
              });
            }
          },
          (error) => {
            console.log(error)
            this.dialogRef.close(false);
            this.snackBar.open('Time log not added: ' + error.error.detail, '', {
              duration: 2000,
            });
          }
        );
      } else if (this.data.type === 'EDIT_TIMELOG') {
        request.id = this.timeLogData.id
        this.time_log_service.updateTimeLog(request).subscribe(
          (response) => {
            console.log(response)
            if (response.error != true) {
              this.dialogRef.close(true);
              this.snackBar.open('Time log updated to .', '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open('Time log not updated.', '', {
                duration: 2000,
              });
            }
          },
          (error) => {
            console.log(error)
            this.dialogRef.close(false);
            this.snackBar.open('Time log not updated: ' + error.error.detail, '', {
              duration: 2000,
            });
          }
        );
      }
    }
  }

  getProjectsByUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.project_service.getProjects(1, 100).pipe(
        catchError((error) => {
          this.snackBar.open(error.error.detail || 'An error occurred', '', {
            duration: 2000,
          });
          reject(error); // Reject the promise if there is an error
          return throwError(error);
        })
      )
      .subscribe((res: Page<any>) => {
        if (res && res.items && res.items.length > 0) {
          this.page = res;
          this.setProjectData(this.page.items);
          resolve(); // Resolve the promise after setting data
        } else {
          this.snackBar.open('No Projects found', '', {
            duration: 2000,
          });
          resolve(); // Resolve the promise even if no projects are found
        }
      });
    });
  }
  

  setProjectData(content: any) {
    this.projects = content;
    console.log(this.projects)
    if (this.projects?.length == 0) {
      this.snackBar.open('No Projects found', '', {
        duration: 2000,
      });
    }
  }

  parseDate(date: Date, time: string): string | null {
    // Format the date part as YYYY-MM-DD
    const datePart = moment(date).format('YYYY-MM-DD');

    // Combine date and time
    const combinedDateTime = moment(`${datePart} ${time}`, 'YYYY-MM-DD HH:mm');

    // Check if the parsing is valid
    if (!combinedDateTime.isValid()) {
        return null; // Return null if invalid
    }

    // Return the formatted date without converting to UTC
    return combinedDateTime.format('YYYY-MM-DDTHH:mm:ss.SSS'); // This will keep it in local time
  }

  setEditTimeLogData(): void {
    // Extract and format date and time parts from timeLogData
    const inDate = this.timeLogData.in_time ? moment(this.timeLogData.in_time).toDate() : null;
    const inTime = this.timeLogData.in_time ? moment(this.timeLogData.in_time).format('HH:mm') : null;
    const outDate = this.timeLogData.out_time ? moment(this.timeLogData.out_time).toDate() : null;
    const outTime = this.timeLogData.out_time ? moment(this.timeLogData.out_time).format('HH:mm') : null;
    
    this.selectedProject = this.projects.find(p => p.id === this.timeLogData.project_id);
    // Patch form values
    this.timeLogDetailsGroup.patchValue({
      project: this.projects.find(p => p.id === this.timeLogData.project_id), 
      description: this.timeLogData.description,
      in_date: inDate,
      in_time: inTime,
      out_date: outDate,
      out_time: outTime,
    });
 
    this.timeLogDetailsGroup.get('project')?.disable();
  }
}

