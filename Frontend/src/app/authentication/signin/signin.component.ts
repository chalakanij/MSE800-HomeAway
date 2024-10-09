import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent  implements OnInit {

  signinForm!: FormGroup;
  isLoading = false;
  hide = true;
  showSignupForm = false;
  @Output() switchToSignup: EventEmitter<void> = new EventEmitter();

  constructor(
    private router: Router,
    private auth_service: AuthService
  ) { }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      grant_type: new FormControl('password'),  // Pre-set values
      scope: new FormControl(''),
      client_id: new FormControl('string'),
      client_secret: new FormControl('string')
    });
  }

  onSubmit() {
    this.signinForm.markAsPristine();
    this.isLoading = true;
    this.auth_service.loginUser({ ...this.signinForm.value }).subscribe((response) => {
        if (response.error) {
          this.isLoading = false;
          this.signinForm.reset();
          this.signinForm.controls.password.setErrors({ invalid: true });
          this.signinForm.controls.username.setErrors({ invalid: true });
        } else {
          this.auth_service.setToken(response.access_token).then((res) => {
            console.log(res);  // Log the token save result
            this.router.navigate(['/app']);
          });
        }
      }
    );
  }

  showSignup() {
    this.switchToSignup.emit();
  }

}

