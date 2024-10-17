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
  isEmployee: boolean = false;  
  employerCode: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth_service: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const formType = params['form'];
      this.showSignupForm = formType === 'signup'; 
      this.isEmployee = formType === 'signupEmployee'; 
      this.employerCode = params['employerCode'] || ''; 
    });
  }

  showSignup() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { form: 'signup' },
      queryParamsHandling: 'merge',
    });
  }

  // showSignupEmployee() {
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: { form: 'signupEmployee', employerCode: this.employerCode },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  showSignin() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { form: 'signin' },
      queryParamsHandling: 'merge',
    });
  }
}
