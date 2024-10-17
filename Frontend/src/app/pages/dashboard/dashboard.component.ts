import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from 'src/app/services/common-service/state-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isAdmin: boolean = false;
  isUnit: boolean = false;
  
  constructor(
    private data: StateService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
  }

}
