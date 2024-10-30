import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  projectDetailsGroup!: FormGroup;
  page!: Page<any>;
  title!: String;
  project!: Number;
  searchKey: String = "";
  projects!: CreateProjectData[];
  pageSize: number = 10;
  isInvalidForm!: boolean;
  statusOptions: string[] = ['INITIAL', 'STARTED', 'ONGOING', 'COMPLETED', 'HALT'];

  constructor(
    private project_service: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<EditProjectComponent>,
    private snackBar: MatSnackBar,
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
  }

  initializeForm() {
    if (this.data.type === 'EDIT_PROJECT') {
      this.title = "Edit Project";
    }
    this.projectDetailsGroup = new FormGroup({
      title: new FormControl({ value: '', disabled: true }, Validators.required),
    description: new FormControl('',),
    status: new FormControl('', Validators.required),
    });
  }

  onSubmit(){

    if (this.projectDetailsGroup.invalid) {
      this.isInvalidForm = true;
      this.projectDetailsGroup.markAllAsTouched();
    } else {
      const request = {
        project_id: this.data.data.id,
        status: this.projectDetailsGroup.value.status
      }
      if (this.data.type === 'EDIT_PROJECT') {
        this.project_service.updateProject(request).subscribe(
          (response) => {
            if (response.error != true) {
              this.dialogRef.close(true);
              this.snackBar.open(this.data.data.title + ' project edited.', '', {
                duration: 2000,
              });
            } else {
              this.dialogRef.close(false);
              this.snackBar.open(this.data.data.title + ' project is not edited.', '', {
                duration: 2000,
              });
            }
          },
          (error) => {
            this.dialogRef.close(false);
            this.snackBar.open(this.data.data.title + ' project is not edited.', '', {
              duration: 2000,
            });
          }
        );
      }
    }
  }
}
