import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  projectDetailsGroup!: FormGroup;
  page!: Page<any>;
  title!: String;
  project!: Number;
  headLbl!: String;
  searchKey: String = "";
  projects!: CreateProjectData[];
  pageSize: number = 10;
  isInvalidForm!: boolean;

  constructor(
    private project_service: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    private snackBar: MatSnackBar,
    private auth_service: AuthService

  ) { }

  ngOnInit(): void {
    this.projectDetailsGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('',  [Validators.required]),
      hours: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    });
    if (this.data.type === 'CREATE_PROJECT') {
      this.title = "Create Project";
    }
  }

  

  // displayWith(obj?: any): string {
  //   return obj ? obj.name : undefined;
  // }

  onSubmit(){

    if (this.projectDetailsGroup.invalid) {
      this.isInvalidForm = true;
      this.projectDetailsGroup.markAllAsTouched();
    } else {
      const request = {
        title: this.projectDetailsGroup.value.title,
        description: this.projectDetailsGroup.value.description,
        work_hours: this.projectDetailsGroup.value.hours
      }
      if (this.data.type === 'CREATE_PROJECT') {
        this.project_service.createProject(request).subscribe(
          (response) => {
            console.log(response)
            if (response.error != true) {
              this.dialogRef.close(true);
              this.snackBar.open(request.title + ' project created.', '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open(request.title + ' project not created.', '', {
                duration: 2000,
              });
            }
          },
          (error) => {
            this.dialogRef.close(false);
            this.snackBar.open(request.title + ' project not created.', '', {
              duration: 2000,
            });
          }
        );
      }
    }
  }
}
