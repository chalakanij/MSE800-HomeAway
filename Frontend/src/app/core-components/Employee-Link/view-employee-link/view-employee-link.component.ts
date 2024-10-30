import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-view-employee-link',
  templateUrl: './view-employee-link.component.html',
  styleUrls: ['./view-employee-link.component.scss']
})
export class ViewEmployeeLinkComponent implements OnInit {

  employerCode!: String; 
  employeeRegisterUrl: string = '';
  isEmployer!: boolean;

  constructor(private auth_service: AuthService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.checkRole()
    this.employerCode = this.auth_service.getCompanyCode();
    console.log(this.employerCode)
    if (this.isEmployer && this.employerCode) {
      console.log("lll")
      this.employeeRegisterUrl = `http://localhost:4200/login?form=signupEmployee&employerCode=${this.employerCode}`;
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

  copyUrl() {
    if (this.employeeRegisterUrl) {
      navigator.clipboard.writeText(this.employeeRegisterUrl).then(() => {
        this.snackBar.open('URL copied to clipboard!', '', { duration: 2000 });
      }).catch(() => {
        this.snackBar.open('Failed to copy URL.', '', { duration: 2000 });
      });
    }
  }

}
