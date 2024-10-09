import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  signinForm!: FormGroup;
  isLoading = false;
  hide = true;
  showSignupForm : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth_service: AuthService
  ) { }

  ngOnInit(): void {
    // this.signinForm = new FormGroup({
    //   username: new FormControl(null, [Validators.required]),
    //   password: new FormControl(null, [Validators.required])
    // });

    this.route.queryParams.subscribe(params => {
      const formType = params['form'];
      this.showSignupForm = formType === 'signup';
    });
  }
  // onSubmit() {
  //   this.signinForm.markAsPristine();
  //   this.isLoading = true;
  //   console.log("test1")
  //   // this.router.navigate(['/app']);
  //   this.auth_service.loginUser({ ...this.signinForm.value }).subscribe((response) => {
  //       if (response.error) {
  //         console.log(response.error)
  //         this.isLoading = false;
  //         this.signinForm.reset();
  //         this.signinForm.controls.password.setErrors({ invalid: true });
  //         this.signinForm.controls.username.setErrors({ invalid: true });
  //       } else {
  //         console.log(response)
  //         this.auth_service.setToken(response.token).then((res) => {
  //           this.router.navigate(['/app']);
  //         });
  //       }
  //     }
  //   );
  // }

  showSignup() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { form: 'signup' },
      queryParamsHandling: 'merge', 
    });
  }

  showSignin() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { form: 'signin' },
      queryParamsHandling: 'merge',
    });
  }

}
