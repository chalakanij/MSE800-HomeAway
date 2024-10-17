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
export class DashBoardService {

    constructor(private http: HttpClient) {}

    //get system summary
    getSummary(): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/v1/initial`;
        httpOptions.params = {
        };
        return this.http.get(endpointUrl, httpOptions);
    }
}