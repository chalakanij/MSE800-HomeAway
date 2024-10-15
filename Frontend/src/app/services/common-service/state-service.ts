import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private titleSource = new BehaviorSubject<string>('Dashboard');
  title = this.titleSource.asObservable()
  
  constructor() { }
  
  changeTitle(title: string) {
    this.titleSource.next(title);
  }
}