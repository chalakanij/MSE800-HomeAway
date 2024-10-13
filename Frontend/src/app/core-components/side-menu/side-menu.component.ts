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

  // expanded = false;
  showSubmenu: boolean = false;
  isShowing = false;
  isDisabledEmployer!: boolean;
  isDisabledEmployee!: boolean;
  @Input() item!: NavItem;

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
      route: 'employers',
    },
  ];

  // mouseenter() {
  //   if (!this.expanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.expanded) {
  //     this.isShowing = false;
  //   }
  // }

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
    this.isDisabledEmployer = false;
    this.isDisabledEmployee = false
    if (this.auth_service.getRoles().includes('EMPLOYER')) {
      this.isDisabledEmployer = true;
    } else if (this.auth_service.getRoles().includes('EMPLOYEE')){
      this.isDisabledEmployee = true
    } else {
      this.isDisabledEmployer = false;
      this.isDisabledEmployee = false
    }
  }

}
