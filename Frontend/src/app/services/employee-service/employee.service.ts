import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEmployeeData } from 'src/app/interface/employer.interface';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
    params: {}
};

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {

    constructor(private http: HttpClient) {}


    //find user
    getEmployees(page: number, size: number): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employees`;
        httpOptions.params = {
            page: page,
            size: size
        };
        return this.http.get(endpointUrl, httpOptions);
    }

    // /delete user
    deleteEmployee(data: String[]): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employees/delete`;
        return this.http.put(endpointUrl, data, httpOptions);
    }

    //edit user
    // editUser(data: CreateEmployerData): Observable<any> {
    //     httpOptions.params = {}
    //     const endpointUrl = `${environment.apiUrl}/v1/employees`;
    //     return this.http.put(endpointUrl, data, httpOptions);
    // }

}