import { Output, EventEmitter, Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateEmployeeData } from 'src/app/interface/employer.interface';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { EmployeeService } from 'src/app/services/employee-service/employee.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<String>();
  @Output() createEvent = new EventEmitter<any>();
  @Output() employeeEvent = new EventEmitter<String>();
  @Output() projectEvent = new EventEmitter<String>();
  @Input() item : String = '';
  @Input() role : String = '';
  @Input() projectList : CreateProjectData[] = [];
  selectedResults!: CreateProjectData[];
  @Input() employeeList : CreateEmployeeData[] = [];
  selectedEmployees!: CreateEmployeeData[];
  page!: Page<any>;

  constructor(private project_service: ProjectService, private snackBar: MatSnackBar,
    private employee_service: EmployeeService
  ) { }

  ngOnInit(): void {
    // this.project_service.getProjects(1,100)
    // this.employee_service.getEmployees(1,100)
    console.log(this.role)
  }

  create() {
    this.createEvent.emit();
  }

  search(value: string) {
    this.searchEvent.emit(value);
  }

  onSelectEmployee(event: any) {
    this.employeeEvent.emit(event.value);
  }

  onSelectProject(event: any) {
    this.projectEvent.emit(event.value);
  }
}
