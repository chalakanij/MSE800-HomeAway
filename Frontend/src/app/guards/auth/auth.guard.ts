import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private auth_service: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.auth_service.getIsAuthenticated();
        let type = route.data["type"] as string;
        if (type == 'login') {
            if (isAuth) {
                this.router.navigate(['/app']);
                return false;
            } else {
                return true;
            }
        } else {
            if (isAuth) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        }
    }
}
