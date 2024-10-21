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

    createProject(data: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/projects`;
        console.log(endpointUrl)
        return this.http.post(endpointUrl, data);
    }

    //find project
    getProjects(page: number, size: number): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/projects`;
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

    updateProject(data: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/projects/`+ `${data.id}` ;
        console.log(endpointUrl)
        return this.http.put(endpointUrl, data);
    }

    assignProject(data: any, id: any): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/projects/users/`+ `${id}` ;
        console.log(endpointUrl)
        return this.http.post(endpointUrl, data);
    }

    getEmployeeByProjects(data: any, page: number, size: number): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/projects/users/`+ `${data}`;
        httpOptions.params = {
            page: page,
            size: size
        };
        return this.http.get(endpointUrl, httpOptions);
    }

}