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

  
  constructor(
    private data: StateService,
    private auth_service: AuthService
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
  }
}
