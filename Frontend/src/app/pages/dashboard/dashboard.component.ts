import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminDashboardData, CountByStatus, EmployeeDashboardData, EmployeeStatus, EmployerDashboardData, ProjectHours, ProjectStatus } from 'src/app/interface/dashboard.interface';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { StateService } from 'src/app/services/common-service/state-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashborad.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading: boolean = false;
  selectedEmployerStats!: EmployerDashboardData;
  selectedEmployeeStats!: EmployeeDashboardData;
  selectedAdminStats!: AdminDashboardData;
  role!: string;
  isCheckedOut: boolean = false;
  employeeCheckoutTime!: string
  employeeCheckinTime!: string

  public employerProjectChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public adminProjectChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  public employerEmployeeChartData: ChartData<'bar'> = {
    labels: ['Employees'],
    datasets: [{ data: [],
     }]
  };

  public adminEmployeeChartData: ChartData<'bar'> = {
    labels: ['Total Employees'],
    datasets: [{ data: [],
     }]
  };

  public adminEmployerChartData: ChartData<'bar'> = {
    labels: ['Total Employers'],
    datasets: [{ data: [],
     }]
  };

  public projectStatusPieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
    }]
};

public employeeProjectChartData: ChartData<'pie'> = {
  labels: [],
  datasets: [{ data: [] }]
};


  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        }
    }
};

  public barChartOptions: ChartOptions<'bar'> = {
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
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.data.changeTitle("Dashboard");
    this.role = this.auth_service.getRoles();
    if(this.role == 'EMPLOYER') {
      this.getEmployerStatData();
    } else if (this.role == 'EMPLOYEE') {
      this.getEmployeeStatData();
    } else if (this.role == 'ADMIN') {
      this.getAdminStatData();
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
    .subscribe((res: EmployerDashboardData) => { 
      this.loading = false; 
      if (res) {
        this.setEmployerStats(res);
        this.setEmployerDashboardStats();
      } else {
        this.snackBar.open('No Employer Stats found', '', { duration: 2000 });
      }
    });
  }

  getEmployeeStatData() {
    this.dashboard_service.getEmployeeStats().pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', { duration: 2000 });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: EmployeeDashboardData) => { 
      this.loading = false; 
      if (res) {
        this.setEmployeeStats(res);
        this.setEmployeeDashboardStats();
      } else {
        this.snackBar.open('No Employee Stats found', '', { duration: 2000 });
      }
    });
  }

  getAdminStatData() {
    this.dashboard_service.getAdminStats().pipe(
      catchError((error) => {
        this.snackBar.open(error.error.detail || 'An error occurred', '', { duration: 2000 });
        this.loading = false;
        return throwError(error);
      })
    )
    .subscribe((res: AdminDashboardData) => { 
      this.loading = false; 
      if (res) {
        this.setAdminStats(res);
        this.setAdminDashboardStats();
      } else {
        this.snackBar.open('No Admin Stats found', '', { duration: 2000 });
      }
    });
  }
  
  setEmployerStats(content: EmployerDashboardData) {
    this.selectedEmployerStats = content;
  }

  setEmployeeStats(content: EmployeeDashboardData) {
    this.selectedEmployeeStats = content;
  }

  setAdminStats(content: AdminDashboardData) {
    this.selectedAdminStats = content;
  }
  
  setEmployerDashboardStats() {
    this.setupEmployerEmployeeChartData(this.selectedEmployerStats.employees);
    this.setupEmployerProjectStatusChartData(this.selectedEmployerStats.projects);
    this.setupProjectStatusPieChartData(this.selectedEmployerStats.project_hours);
  }

  setEmployeeDashboardStats() {
    this.setupEmployeeProjectStatusChartData(this.selectedEmployeeStats.projects);
    if (this.selectedEmployeeStats.last_checkout == null) {
      this.isCheckedOut = false
      this.employeeCheckinTime = moment(this.selectedEmployeeStats.last_checkin).format('YYYY-MM-DD HH:mm:ss')
    } else {
      this.isCheckedOut = true
      this.employeeCheckoutTime = moment(this.selectedEmployeeStats.last_checkout).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  setAdminDashboardStats() {
    this.setupAdminEmployeeChartData(this.selectedAdminStats.employees);
    this.setupAdminProjectStatusChartData(this.selectedAdminStats.projects);
    this.setupAdminEmployersChartData(this.selectedAdminStats.employers);
  }

  setupEmployerEmployeeChartData(employeeStatus: EmployeeStatus[]) {
    const data = employeeStatus.map(item => item.count);
  
    this.employerEmployeeChartData = {
      labels: ['Employees'],
      datasets: [{
        data: data,
        label: "Number of Employees",
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    };
  
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  setupEmployerProjectStatusChartData(projectStatus: ProjectStatus[]) {
    const labels = projectStatus.map(status => status.status);
    const data = projectStatus.map(status => status.count);
    const backgroundColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)'
    ];
    const borderColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)'
    ];
  
    this.employerProjectChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor.slice(0, data.length),  
        borderColor: borderColor.slice(0, data.length),
        borderWidth: 1
      }]
    };
    this.cdr.detectChanges();
  }


  setupProjectStatusPieChartData(projectHours: ProjectHours[]) {
    const labels = projectHours.map(project => project.project_title);
    const data = projectHours.map(project => project.work_hours);

    this.projectStatusPieChartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 71, 1)'
          ],
          borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 71, 1)'
          ],
            borderWidth: 1
        }]
    };
    this.cdr.detectChanges();
}

setupAdminEmployeeChartData(employees: CountByStatus[]) {
  const data = employees.map(item => item.count);

  this.adminEmployeeChartData = {
    labels: ['Total Employees'],
    datasets: [{
      data: data,
      label: "Total Number of Employees",
      backgroundColor: 'rgba(54, 162, 235, 1)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2
    }]
  };

  setTimeout(() => {
    this.cdr.detectChanges();
  });
}

setupAdminProjectStatusChartData(projects: CountByStatus[]) {
  const labels = projects.map(status => status.status);
  const data = projects.map(status => status.count);
  const backgroundColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)'
  ];
  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)'
  ];

  this.adminProjectChartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: backgroundColor.slice(0, data.length),  
      borderColor: borderColor.slice(0, data.length),
      borderWidth: 1
    }]
  };
  this.cdr.detectChanges();
}

setupAdminEmployersChartData(employers: CountByStatus[]) {
  const data = employers.map(item => item.count);

  this.adminEmployerChartData = {
    labels: ['Total Employers'],
    datasets: [{
      data: data,
      label: "Total Number of Employers",
      backgroundColor: 'rgba(54, 162, 235, 1)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2
    }]
  };

  setTimeout(() => {
    this.cdr.detectChanges();
  });
}

setupEmployeeProjectStatusChartData(projectStatus: ProjectStatus[]) {
  const labels = projectStatus.map(status => status.status);
  const data = projectStatus.map(status => status.count);
  const backgroundColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)'
  ];
  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)'
  ];

  this.employeeProjectChartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: backgroundColor.slice(0, data.length),  
      borderColor: borderColor.slice(0, data.length),
      borderWidth: 1
    }]
  };
  setTimeout(() => {
    this.cdr.detectChanges();
  });
}



}