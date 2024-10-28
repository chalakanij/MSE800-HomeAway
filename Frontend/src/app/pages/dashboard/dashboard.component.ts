import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardData, EmployeeStatus, EventData, ProjectHours, ProjectStatus } from 'src/app/interface/dashboard.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { StateService } from 'src/app/services/common-service/state-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashborad.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading: boolean = false;
  selectedEmployerStats!: DashboardData;
  selectedEmployeeStats!: EventData;
  role!: string;

  public employerProjectChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public employerEmployeeChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public employerProjectHoursChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public employeeChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };
  
  constructor(
    private data: StateService,
    private auth_service: AuthService,
    private dashboard_service: DashboardService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef here
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
    if(this.auth_service.getRoles() == 'EMPLOYER') {
      this.getEmployerStatData();
    } else if (this.auth_service.getRoles() == 'EMPLOYEE') {
      this.getEmployeeStatData();
    }
  }

  getEmployerStatData() {
    this.dashboard_service.getEmployerStats().pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', {
          duration: 2000,
        });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: DashboardData) => { 
      this.loading = false; 
      if (res) {
        this.setEmployerStats(res);
      } else {
        this.snackBar.open('No Employer Stats found', '', { duration: 2000 });
      }
    });
  }

  setEmployerStats(content: DashboardData) {
    this.selectedEmployerStats = content;
    this.setupEmployerEmployeeChartData(this.selectedEmployerStats.employees);
    this.setupEmployerProjectStatusChartData(this.selectedEmployerStats.project_status);
    this.setupProjectHoursChartData(this.selectedEmployerStats.project_hours)
  }

  setupEmployerEmployeeChartData(employeeStatus: EmployeeStatus[]) {
    this.employerEmployeeChartData.labels = employeeStatus.map(status => status.status);
    this.employerEmployeeChartData.datasets[0].data = employeeStatus.map(status => status.count);
    this.cdr.detectChanges();  // Trigger change detection
  }

  setupProjectHoursChartData(projectHours: ProjectHours[]) {
    this.employerProjectHoursChartData.labels = projectHours.map(hour => hour.project_id);
    this.employerProjectHoursChartData.datasets[0].data = projectHours.map(hour => hour.work_hours);
    this.cdr.detectChanges();  // Trigger change detection
  }

  setupEmployerProjectStatusChartData(projectStatus: ProjectStatus[]) {
    this.employerProjectChartData.labels = projectStatus.map(status => status.status);
    this.employerProjectChartData.datasets[0].data = projectStatus.map(status => status.count);
    this.cdr.detectChanges();  // Trigger change detection
  }

  getEmployeeStatData() {
    this.dashboard_service.getEmployeeStats().pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', { duration: 2000 });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: EventData) => { 
      this.loading = false; 
      if (res) {
        this.setEmployeeStats(res);
      } else {
        this.snackBar.open('No Employee Stats found', '', { duration: 2000 });
      }
    });
  }

  setEmployeeStats(content: EventData) {
    this.selectedEmployeeStats = content;
    this.setupEmployeeChartData(this.selectedEmployeeStats.projects);
  }

  setupEmployeeChartData(projects: ProjectStatus[]) {
    this.employeeChartData.labels = projects.map(project => project.status);
    this.employeeChartData.datasets[0].data = projects.map(project => project.count);
    this.cdr.detectChanges();  // Trigger change detection
  }
}