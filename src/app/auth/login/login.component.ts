import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;


  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servicio de autenticación:', response);
        if (response.access) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
          this.clearFields();
        }
      },
      error: (error: any) => {
        console.error('Error en la autenticación:', error);
        this.errorMessage = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
        this.clearFields();
      }
    });
  }

  clearFields() {
    this.username = '';
    this.password = '';
  }

}
