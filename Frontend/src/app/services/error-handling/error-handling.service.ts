import { Injectable, ErrorHandler } from '@angular/core';
import { FORBIDDEN, NOT_FOUND } from 'http-status-codes';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlingService implements ErrorHandler {
    constructor(private router: Router, private auth_service: AuthService) {}
    public handleError(error: any) {
        const httpErrorCode = error.status;
        switch (httpErrorCode) {
            case FORBIDDEN:
                this.auth_service.logoutUser();
                this.router.navigate(['/login']);
                break;

            case NOT_FOUND:
                this.router.navigate(['/error/nonexistent']);
                break;

            default:
                // do nothing
                break;
        }
    }
}
