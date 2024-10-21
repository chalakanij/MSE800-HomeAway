import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/common-service/state-service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title!: String;
  subscription!: Subscription;
  username!: String;
  employeeId!: String;

  @Output() toggled = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private data: StateService
  ) { }

  ngOnInit(): void {
    this.subscription = this.data.title.subscribe(title => this.title = title);
    this.getUsernameAndEmployeeId();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onToggle(): void {
    this.toggled.emit(true)
  }

  click1() {
    this.router.navigate(['/app']);
  }
  
  logout() {
    this.authService.logoutUser()
    this.router.navigate(['/login']);
  }

  getUsernameAndEmployeeId() {
    this.username = this.authService.getName();
    // this.employeeId = this.authService.getEmployeeId();
  }

}
