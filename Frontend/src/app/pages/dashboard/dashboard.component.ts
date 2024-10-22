import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { StateService } from 'src/app/services/common-service/state-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isAdmin: boolean = false
  employerCode!: String; 
  employeeRegisterUrl: string = '';
  isEmployer!: boolean;

  
  constructor(
    private data: StateService,
    private snackBar: MatSnackBar,
    private auth_service: AuthService
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
    this.checkRole()
    this.employerCode = this.auth_service.getCompanyCode();
    console.log(this.employerCode)
    if (this.isEmployer && this.employerCode) {
      console.log("lll")
      this.employeeRegisterUrl = `http://localhost:4200/login?form=signupEmployee&employerCode=${this.employerCode}`;
    }
  }

  copyUrl() {
    if (this.employeeRegisterUrl) {
      navigator.clipboard.writeText(this.employeeRegisterUrl).then(() => {
        this.snackBar.open('URL copied to clipboard!', '', { duration: 2000 });
      }).catch(() => {
        this.snackBar.open('Failed to copy URL.', '', { duration: 2000 });
      });
    }
  }

  checkRole() {
    this.isEmployer = false
    if (this.auth_service.getRoles().includes('EMPLOYER')) {
      this.isEmployer = true;
    } else {
      this.isEmployer = false
    }
  }

}
