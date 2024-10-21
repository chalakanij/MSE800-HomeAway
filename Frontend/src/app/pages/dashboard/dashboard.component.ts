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
  employerCode!: string; 
  employeeRegisterUrl: string = '';
  isEmployer!: boolean;

  
  constructor(
    private data: StateService,
    private snackBar: MatSnackBar,
    private auth_service: AuthService
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
    if (this.employerCode) {
      this.employeeRegisterUrl = `http://localhost:4200/login?form=signupEmployee&employerCode=${this.employerCode}`;
    }
    this.checkRole()
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
