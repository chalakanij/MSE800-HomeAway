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

    // /delete employee
    deleteEmployee(data: { user_id: number[] }): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employees`;
        const options = {
            ...httpOptions,
            body: data // Attach the data to the body property
        };
        return this.http.delete(endpointUrl, options);
    }

    //find user
    getEmployers(page: number, size: number): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employers`;
        httpOptions.params = {
            page: page,
            size: size
        };
        return this.http.get(endpointUrl, httpOptions);
    }

    //edit user
    // editUser(data: CreateEmployerData): Observable<any> {
    //     httpOptions.params = {}
    //     const endpointUrl = `${environment.apiUrl}/v1/employees`;
    //     return this.http.put(endpointUrl, data, httpOptions);
    // }

    getProfile(): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/profile`
        return this.http.get<any>(endpointUrl, httpOptions);
      }
    
      updateProfile(profileData: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/profile`
        return this.http.put<any>(endpointUrl, profileData, httpOptions);
      }

}