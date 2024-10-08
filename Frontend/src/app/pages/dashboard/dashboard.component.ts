import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { IntialDetail } from 'src/app/interface/initialDetails.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { DashBoardService } from 'src/app/services/common-service/dashboard.service';
import { StateService } from 'src/app/services/common-service/state-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isAdmin: boolean = false;
  isUnit: boolean = false;
  // initialDetails: IntialDetail = {
  //   accepted_asset_transfer_requests_admin: new Number,
  //   all_users_count: new Number(null),
  //   active_users_count: new Number(null),
  //   all_assets_count: new Number(null),
  //   active_assets_count: new Number(null),
  //   all_units_count: new Number(null),
  //   active_units_count: new Number(null),
  //   all_asset_transfer_requests_user: new Number(null),
  //   pending_asset_transfer_requests_user: new Number(null),
  //   accepted_asset_transfer_requests_user: new Number(null),
  //   rejected_asset_transfer_requests_user: new Number(null),
  //   canceled_asset_transfer_requests_user: new Number(null),
  //   all_asset_transfer_requests_admin: new Number(null),
  //   pending_asset_transfer_requests_admin: new Number(null),
  //   rejected_asset_transfer_requests_admin: new Number(null),
  //   canceled_asset_transfer_requests_admin: new Number(null),
  //   all_asset_transfer_requests_unit: new Number(null),
  //   pending_asset_transfer_requests_unit: new Number(null),
  //   accepted_asset_transfer_requests_unit: new Number(null),
  //   rejected_asset_transfer_requests_unit: new Number(null),
  //   canceled_asset_transfer_requests_unit: new Number(null),
  //   all_asset_type_count: new Number(null), 
  //   all_designation_count: new Number(null)
  // };

  constructor(
    private data: StateService,
    private authService: AuthService,
    private dashBoardService: DashBoardService,
    private snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
    this.getSummaryDetails();
    this.isAdminRole();
    this.isUnitRole();
  }

  isAdminRole() {
    if (this.authService.getRoles().includes('ROLE_ADMIN')) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  isUnitRole() {
    if (this.authService.getRoles().includes('ROLE_UNIT')) {
      this.isUnit = true;
    } else {
      this.isUnit = false;
    }
  }

  getSummaryDetails() {
    this.dashBoardService.getSummary().subscribe((res) => {
      if (!res.error) {
        // this.initialDetails = res.body;
      } else {
        this.snackBar.open('No Summary Data found', '', {
          duration: 2000,
        });
      }
    });

  }

}
