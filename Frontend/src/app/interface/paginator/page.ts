import  { Sort } from './sort';
import  { Pageable } from './pageable';
 
export class Page<T> {
  content!: Object[];
  pageable: Pageable;
  last!: boolean;
  totalPages!: number;
  totalElements!: number;
  first!: boolean;
  sort!: Sort;
  numberOfElements!: number;
  size!: number;
  number!: number;
  empty!: boolean;
 
  public constructor() {
    this.pageable = new Pageable();
  }
}
