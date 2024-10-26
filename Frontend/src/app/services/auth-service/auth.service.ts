import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUserData, RegisterEmployeeData, RegisterUserData } from 'src/app/interface/auth.interfaces';
import jwt_decode from "jwt-decode";
import { JwtTokenInterface } from 'src/app/interface/common.interfaces';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private isAuthenticated = false;
    private email!: String;
    private name!: String;
    private token!: String;
    private roles!: String;
    private companyCode!: String;
    private userId!: Number;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient) { }

    // login a user
    loginUser(data: LoginUserData): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/login`;
        const body = new HttpParams()
            .set('grant_type', data.grant_type)
            .set('username', data.username)
            .set('password', data.password)
            .set('scope', data.scope || '')
            .set('client_id', data.client_id)
            .set('client_secret', data.client_secret);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            })
        };
        return this.http.post(endpointUrl, body.toString(), httpOptions);
    }

    //register a user
    registerUser(data: RegisterUserData): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employer_register`;
        return this.http.post(endpointUrl, data, httpOptions);
    }

    registerEmployee(data: RegisterEmployeeData): Observable<any> {
        const endpointUrl = `${environment.apiUrl}/employee_register`;
        return this.http.post(endpointUrl, data, httpOptions);
    }

    // logout the user
    logoutUser() {
        this.clearAuthLocal();
        this.isAuthenticated = false;
        this.token = '';
        this.authStatusListener.next(false);
    }

    // save the login token in the app
    setToken(token: string) {
        return new Promise((resolve, reject) => {
            this.saveAuthLocal(token);
            this.token = token;
            const decodeToken: JwtTokenInterface = this.decodeToken(token);
            console.log(decodeToken)
            this.name = decodeToken.first_name + ' ' + decodeToken.last_name;
            this.roles = decodeToken.role;
            this.companyCode = decodeToken.code;
            this.userId = decodeToken.user_id;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            console.log(this.userId)
            if (this.token === token) {
                resolve('Token saved');
            } else {
                reject('Token is not saved');
            }
            console.log("222")
        });
    }

    // save login token and the uuid in the local storage
    private saveAuthLocal(token: string) {
        localStorage.setItem('token', token);
    }

    // get the login token and the uui stored in the local storage
    getAuthLocal() {
        const token = localStorage.getItem('token');
        const useremployeeId = 'localStorage.getItem(employeeId)';
        if (token && useremployeeId) {
            return { token, useremployeeId };
        } else {
            return null;
        }
    }

    // get the locally stored login token and uuid and save it in the app
    autoAuthUser() {
        const authData = this.getAuthLocal();
        if (authData) {
            this.token = authData.token;
            this.authStatusListener.next(true);
        }
    }

    // get the login token
    getToken() {
        return this.token;
    }

    // get the email
    getEmail() {
        return this.email;
    }

    getUserId() {
        return this.userId;
    }
    
    // get the name
    getName() {
        return this.name;
    }

    // get roles
    getRoles() {
        return this.roles;
    }

    getCompanyCode() {
        return this.companyCode;
    }

    // clear local storage
    private clearAuthLocal() {
        localStorage.removeItem('token');
    }

    // get the authenticated status of the user
    getIsAuthenticated() {
        this.autoAuthUser()
        let decodedToken: JwtTokenInterface = this.decodeToken(this.token);
        this.name =  decodedToken.first_name + ' ' + decodedToken.last_name;
        this.roles = decodedToken.role
        this.email = decodedToken.email
        if (decodedToken.exp * 1000 > Date.now()) {
            this.isAuthenticated = true;
        } else {
            this.isAuthenticated = false;
        }
        if (this.isAuthenticated) {
            return true;
        } else {
            if (this.getAuthLocal()?.token != null) {
                let decodedToken: JwtTokenInterface = this.decodeToken(this.token);
                this.name = decodedToken.first_name + ' ' + decodedToken.last_name;
                this.roles = decodedToken.role
                if (decodedToken.exp * 1000 > Date.now()) {
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
                if (this.isAuthenticated) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    private decodeToken(token: String): JwtTokenInterface {
        let decode: JwtTokenInterface;
        try {
            return jwt_decode(token?.toString());
        } catch (error) {
            return {
                first_name: '',
                last_name: '',
                role: '',
                title: '',
                code: '',
                email: '',
                user_id: 0,
                exp: 0
            }
        }
    }

}