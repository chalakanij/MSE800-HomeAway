import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/interface/nav-items';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StateService } from 'src/app/services/common-service/state-service';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  })
export class SideMenuComponent {

  showSubmenu: boolean = false;
  isShowing = false;
  isDisabledEmployer!: boolean;
  isDisabledEmployee!: boolean;
  @Input() item!: NavItem;
  role!:string;

  navItems: NavItem[] = [
    {
      displayName: 'Dashboard',
      iconName: 'dashboard',
      route: '',
    },
    {
      displayName: 'Projects',
      iconName: 'category',
      route: 'projects'
    },
    {
      displayName: 'Time Logs',
      iconName: 'timelapse',
      route: 'time-logs',
    },
    {
      displayName: 'Employers',
      iconName: 'supervisor_account',
      route: 'employers',
    },
    {
      displayName: 'Employees',
      iconName: 'engineering',
      route: 'employees',
    },
  ];

  ngOnInit(): void {
    this.checkRole();
  }

  constructor(
    public router: Router,
    private data: StateService,
    private auth_service: AuthService
  ) {
  }

  onItemSelected(item: NavItem) {
    this.router.navigate(["app/" + item.route]);
    this.data.changeTitle(item.displayName);
  }

  checkRole() {
    if (this.auth_service.getRoles().includes('EMPLOYER')) {
      this.role = 'Employer'
    } else if (this.auth_service.getRoles().includes('EMPLOYEE')){
      this.role = 'Employee'
    } if (this.auth_service.getRoles().includes('ADMIN')){
      this.role = 'Admin'
    } 
  }

}
