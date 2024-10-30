import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
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
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.timeLogDetailsGroup = new FormGroup({
      project: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      in_time: new FormControl('', [Validators.required]),
      in_date: new FormControl('', [Validators.required]),
      out_time: new FormControl(''),
      out_date: new FormControl(''),
    }, { validators: this.dateTimeValidation() });

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

  getErrorMessage(controlName: string, errorType: string): string {
    const control = this.timeLogDetailsGroup.get(controlName);
    console.log(control)
    console.log(errorType)
    if (errorType === 'dateAndTimeRequired' && this.timeLogDetailsGroup.errors?.dateAndTimeRequired) {
      return this.timeLogDetailsGroup.errors.dateAndTimeRequired;
    }

    if (errorType === 'inTimeAfterOutTime' && this.timeLogDetailsGroup.errors?.inTimeAfterOutTime) {
      return this.timeLogDetailsGroup.errors.inTimeAfterOutTime;
    }

    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }

    return '';
  }

  onSubmit() {
    this.isInvalidForm = this.timeLogDetailsGroup.invalid;
    if (this.isInvalidForm) {
      this.timeLogDetailsGroup.markAllAsTouched();
      return;
    } else {
      const inDate = this.timeLogDetailsGroup.value.in_date;
      const inTime = this.timeLogDetailsGroup.value.in_time;
      const outDate = this.timeLogDetailsGroup.value.out_date;
      const outTime = this.timeLogDetailsGroup.value.out_time;

      const inTimeISO = inDate && inTime ? this.parseDate(inDate, inTime) : null;
      const outTimeISO = outDate && outTime ? this.parseDate(outDate, outTime) : null;

      let request: any = {
        project_id: this.timeLogDetailsGroup.value.project ? this.timeLogDetailsGroup.value.project.id : this.selectedProject.id,
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
              this.snackBar.open('New time log added to ' + this.timeLogDetailsGroup.value.project.title, '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open('Time log not added to ' + this.timeLogDetailsGroup.value.project.title, '', {
                duration: 2000,
              });
            }
          },
          (error) => {
            console.log(error)
            this.dialogRef.close(false);
            this.snackBar.open('Time log not added to: ' + error.error.detail, '', {
              duration: 2000,
            });
          }
        );
      } else if (this.data.type === 'EDIT_TIMELOG') {
        request.id = this.timeLogData.id
        this.time_log_service.updateTimeLog(request).subscribe(
          (response) => {
            if (response.error != true) {
              this.dialogRef.close(true);
              this.snackBar.open('Time log of ' + this.data.data.title + ' updated', '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open('Time log of ' + this.data.data.title + ' not updated.', '', {
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
          reject(error);
          return throwError(error);
        })
      )
        .subscribe((res: Page<any>) => {
          if (res && res.items && res.items.length > 0) {
            this.page = res;
            this.setProjectData(this.page.items);
            resolve();
          } else {
            this.snackBar.open('No Projects found', '', {
              duration: 2000,
            });
            resolve();
          }
        });
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
    const datePart = moment(date).format('YYYY-MM-DD');
    const combinedDateTime = moment(`${datePart} ${time}`, 'YYYY-MM-DD HH:mm');

    if (!combinedDateTime.isValid()) {
      return null;
    }

    return combinedDateTime.format('YYYY-MM-DDTHH:mm:ss.SSS');
  }

  setEditTimeLogData(): void {
    const inDate = this.timeLogData.in_time ? moment(this.timeLogData.in_time).toDate() : null;
    const inTime = this.timeLogData.in_time ? moment(this.timeLogData.in_time).format('HH:mm') : null;
    const outDate = this.timeLogData.out_time ? moment(this.timeLogData.out_time).toDate() : null;
    const outTime = this.timeLogData.out_time ? moment(this.timeLogData.out_time).format('HH:mm') : null;

    this.selectedProject = this.projects.find(p => p.id === this.timeLogData.project_id);
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

  dateTimeValidation(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const inDate = group.get('in_date')?.value;
      const inTime = group.get('in_time')?.value;
      const outDate = group.get('out_date')?.value;
      const outTime = group.get('out_time')?.value;

      const errors: any = {};

      if ((inDate && !inTime) || (!inDate && inTime)) {
        errors.dateAndTimeRequired = 'Date and time must be entered for In Time';
      }
      if ((outDate && !outTime) || (!outDate && outTime)) {
        errors.dateAndTimeRequired = 'Date and time must be entered for Out Time';
      }

      if (inDate && inTime && outDate && outTime) {
        console.log("llll")
        const inTimeISO = inDate && inTime ? this.parseDate(inDate, inTime) : null;
        const outTimeISO = outDate && outTime ? this.parseDate(outDate, outTime) : null;

        if (inTimeISO && outTimeISO) {
          const inDateTime = moment(inTimeISO);
          const outDateTime = moment(outTimeISO);

          if (inDateTime.isAfter(outDateTime)) {
            errors.inTimeAfterOutTime = 'In time should be before Out time';
          }
        }

      }

      return Object.keys(errors).length ? errors : null;
    };
  }
}

