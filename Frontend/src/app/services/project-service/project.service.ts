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
export class ProjectService {

    constructor(private http: HttpClient) {}


    //find user
    getProjects(page: number, size: number): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/project`;
        httpOptions.params = {
            page: page,
            size: size
        };
        return this.http.get(endpointUrl, httpOptions);
    }

    // /delete user
    deleteProject(data: Number[]): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/project/delete`;
        return this.http.put(endpointUrl, data, httpOptions);
    }

    //create user
    createProject(data: CreateProjectData): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/project`;
        return this.http.post(endpointUrl, data, httpOptions);
    }

}