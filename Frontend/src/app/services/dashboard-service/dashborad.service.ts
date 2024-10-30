import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
export class DashboardService {

    constructor(private http: HttpClient) {}

    getEmployerStats(): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employer_dashboard`;
        return this.http.get(endpointUrl, httpOptions);
    }

    getEmployeeStats(): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employee_dashboard`;
        return this.http.get(endpointUrl, httpOptions);
    }

    getAdminStats(): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/admin_dashboard`;
        return this.http.get(endpointUrl, httpOptions);
    }
}