import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  titleOptions: string[] = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
  showSigninForm!: boolean;
  @Output() switchToSignin: EventEmitter<void> = new EventEmitter();
  isLoading = false;
  employerCode: string = ''
  


  constructor(private fb: FormBuilder, private auth_service: AuthService, private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      title: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      company_name: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator // Apply the validator to the form group
    });
  }
  
  // Custom validator to check if the passwords match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');
  
    // Only apply the mismatch error if both controls are not null and the values don't match
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      // If the passwords match or are untouched, clear the error
      confirmPassword?.setErrors(null);
    }
  }
  
  
  
  onSubmit() {
    if (this.signupForm.valid) {
        const { confirm_password, ...formData } = this.signupForm.value;
      this.auth_service.registerUser({ ...formData }).pipe(
        catchError((error) => {
          this.snackBar.open(error.error.detail || 'An error occurred', '', {
            duration: 2000,
          });
          this.isLoading = false;
          return throwError(error);
        })
      )
      .subscribe(
        (response) => {
          console.log(response)
          if (response.error) {
            this.isLoading = false;
            this.snackBar.open(response.error, '', {
              duration: 2000,
            });
            this.signupForm.reset();
          } else {
            this.employerCode = response.employer_code;
            console.log(this.employerCode)
            this.router.navigate(['/login']);
   
          }
        }
      );
  } else {
    this.signupForm.markAllAsTouched();
  }
}

  showSignin() {
    this.switchToSignin.emit();
  }
}
