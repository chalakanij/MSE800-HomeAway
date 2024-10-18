import { Output, EventEmitter, Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    console.log(this.item)
    console.log(this.role)
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


}
