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
    if (this.data.type === 'CREATE_TIMELOG') {
      this.title = "Create Time Log";
    }
    this.getProjectsByUser();
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
      console.log(outTimeISO)
      console.log(inTimeISO)

      let request: any = {
        project_id: this.timeLogDetailsGroup.value.project.id,
        description: this.timeLogDetailsGroup.value.description,
        in_time: inTimeISO,
      };

      if (outTimeISO) {
        request.out_time = outTimeISO;
      }
      console.log(this.timeLogDetailsGroup.value.out_time)
      console.log(this.timeLogDetailsGroup.value.out_date)
      console.log(this.timeLogDetailsGroup.value.in_time)
      console.log(this.timeLogDetailsGroup.value.in_date)
    
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
            this.dialogRef.close(false);
            this.snackBar.open('Time log not added.', '', {
              duration: 2000,
            });
          }
        );
      }
    }
  }

  getProjectsByUser() {
    this.project_service.getProjectsByUser(this.auth_service.getUserId()).pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        return throwError(error);
      })
    )
      .subscribe((res: Page<any>) => {
        if (res && res.items && res.items.length > 0) {
          this.page = res;
          this.setProjectData(this.page.items);
        } else {
          this.snackBar.open('No Projects found', '', {
            duration: 2000,
          });
        }
      });
  }

  setProjectData(content: any) {
    this.projects = content;
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
}

