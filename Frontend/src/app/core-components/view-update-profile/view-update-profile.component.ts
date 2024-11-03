import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee-service/employee.service';

@Component({
  selector: 'app-view-update-profile',
  templateUrl: './view-update-profile.component.html',
  styleUrls: ['./view-update-profile.component.scss']
})
export class ViewUpdateProfileComponent implements OnInit {

  profileForm: FormGroup;
  isEditing = false;
  role: string = ''; 
  title: string = 'View Profile'
  titleOptions: string[] = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];

  constructor(
    private fb: FormBuilder,
    private employee_service: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      title: [{ value: '', disabled: true }, Validators.required],
      first_name: [{ value: '', disabled: true }, Validators.required],
      last_name: [{ value: '', disabled: true }, Validators.required],
      phone_number: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      company_name: [{ value: '', disabled: true }, Validators.required], 
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], 
      role: [{ value: '', disabled: true }, Validators.required],
    });
    
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.employee_service.getProfile().subscribe((data) => {
      this.profileForm.patchValue(data);
      this.role = data.role;
      if (this.role !== 'EMPLOYER') {
        this.profileForm.get('company_name')?.disable();
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.title = 'Update Profile'
    this.profileForm.enable();
    if (this.role !== 'EMPLOYER') {
      this.profileForm.get('company_name')?.disable(); 
    }
    this.profileForm.get('email')?.disable();
    this.profileForm.get('role')?.disable();
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.getRawValue();
      console.log(profileData)
      this.employee_service.updateProfile(profileData).subscribe(
        () => {
          this.snackBar.open('Profile updated successfully', '', {
            duration: 2000
          });
          this.loadProfile();
          this.isEditing = false;
          this.profileForm.disable();
        },
        (error) => {
          let errorMessage = 'An error occurred while updating the profile. Please try again later.';
          
          if (error.status === 400) {
            errorMessage = 'Invalid input. Please check your data and try again.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
  
          this.snackBar.open(errorMessage, 'Close', {
            duration: 4000
          });
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 4000
      });
    }
  }  
}