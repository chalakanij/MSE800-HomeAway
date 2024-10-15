import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth-service/auth.service';
import { ErrorHandlingService } from '../error-handling/error-handling.service';

@Injectable()
export class HttpInterceptorService {
    constructor(private _authService: AuthService, private _errorHandlingService: ErrorHandlingService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this._authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token),
        });
        return next.handle(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                this._errorHandlingService.handleError(error);
                return throwError(error);
            })
        );
    }
}
