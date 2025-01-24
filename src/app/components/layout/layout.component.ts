import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  username: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.ensureValidToken().subscribe((token) => {
      if (token) {
        this.username = this.authService.getUsername();
        console.log('Token is valid and refreshed if needed:', token);
      } else {
        console.log('User is logged out or no valid token exists.');
      }
    });
  }

  // getUserName(): string {
  //   return this.authService.getUsername() ?? ''; 
  // }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  isLoggedIn(): void {
    this.authService.isLoggedIn();
  }
}

