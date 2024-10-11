import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

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
  


  constructor(private fb: FormBuilder, private auth_service: AuthService, private router: Router,) {
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
        console.log('Submitted Data:', formData);
        console.log(this.signupForm.value);
      this.auth_service.registerUser({ ...formData }).subscribe((response) => {
        if (response.error) {
          console.log(response.error)
          this.isLoading = false;
          this.signupForm.reset();
        } else {
          console.log(response)
          this.auth_service.setToken(response.token).then((res) => {
            this.router.navigate(['/login']);
          });
        }
      }
    );
    } else {
      this.signupForm.markAllAsTouched(); 
    }
  }

  // Method to emit the event
  showSignin() {
    this.switchToSignin.emit();
  }
}