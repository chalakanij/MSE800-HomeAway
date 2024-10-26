import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProjectData } from 'src/app/interface/project.interface';
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
export class TimeLogService {

    constructor(private http: HttpClient) {}

    createTimeLogCheckin(data: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/checkin`;
        console.log(endpointUrl)
        return this.http.post(endpointUrl, data);
    }

    createTimeLogCheckout(data: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/checkout`;
        console.log(endpointUrl)
        return this.http.post(endpointUrl, data);
    }

    getTimeLogs(page: number, size: number, user_id: Number, project_id: Number): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/checkinout`;
        if (user_id !== undefined && project_id !== undefined) {
        httpOptions.params = {
            page: page,
            size: size,
            user_id: user_id,
            project_id: project_id
        };
    } else if (user_id == undefined && project_id == undefined) {
        httpOptions.params = {
            page: page,
            size: size,
        };
    } else if (user_id == undefined) {
        httpOptions.params = {
            page: page,
            size: size,
            project_id: project_id
        };
    } else if (project_id == undefined) {
        httpOptions.params = {
            page: page,
            size: size,
            user_id: user_id
        };
    } 
        return this.http.get(endpointUrl, httpOptions);
    }

    // /delete user
    deleteTimeLog(data: Number[]): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/project/delete`;
        return this.http.put(endpointUrl, data, httpOptions);
    }

    updateTimeLog(data: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/checkinout` ;
        console.log(endpointUrl)
        return this.http.put(endpointUrl, data);
    }

}