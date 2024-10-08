import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent  implements OnInit {

  signinForm!: FormGroup;
  isLoading = false;
  hide = true;

  constructor(
    private router: Router,
    // private auth_service: AuthService
  ) { }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    // this.signinForm.markAsPristine();
    this.isLoading = true;
    console.log("test")
    this.router.navigate(['/app']);
    // this.auth_service.loginUser({ ...this.signinForm.value }).subscribe((response) => {
    //     if (response.error) {
    //       this.isLoading = false;
    //       this.signinForm.reset();
    //       this.signinForm.controls.password.setErrors({ invalid: true });
    //       this.signinForm.controls.username.setErrors({ invalid: true });
    //     } else {
          // this.auth_service.setToken(response.token).then((res) => {
            // this.router.navigate(['/app']);
      //     });
      //   }
      // }
    // );
  }

}

