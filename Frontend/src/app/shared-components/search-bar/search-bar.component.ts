import { Output, EventEmitter, Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Page } from 'src/app/interface/paginator/page';
import { CreateProjectData } from 'src/app/interface/project.interface';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<String>();
  @Output() createEvent = new EventEmitter<any>();
  @Output() notificationEvent = new EventEmitter<String>();
  @Input() item : String = '';
  @Input() role : String = '';
  @Input() projectList : CreateProjectData[] = [];
  selectedResults!: CreateProjectData[];
  page!: Page<any>;

  constructor(private project_service: ProjectService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    console.log(this.item)
    console.log(this.role)
    this.project_service.getProjects(1,100)
  }

  create() {
    this.createEvent.emit();
  }

  search(value: string) {
    this.searchEvent.emit(value);
  }

  showNotification(value: string) {
    this.notificationEvent.emit(value);
  }

  showRequest(value: string) {
    this.notificationEvent.emit(value);
  }

  onSelect(event: any) {
    console.log('Selected option:', event.value);
  }
}
