import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('Verifying authentication status...');
    if (this.authService.getToken()) {
      console.log('User is authenticated. Granting access to the protected route.');
      return true;
    } else {
      console.log('User is not authenticated. Redirecting to login page.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
