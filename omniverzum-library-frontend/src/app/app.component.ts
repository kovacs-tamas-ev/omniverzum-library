import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/services/auth.service';
import { HeaderComponent } from './header/header.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Omniverzum-könyvtár';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedInUserOrNavigateToLogin();
  }

  private async getLoggedInUserOrNavigateToLogin(): Promise<void> {
    const hasLoggedInUser = await this.authService.loadUserFromStoredTokenIfPresent();
    if (!hasLoggedInUser) {
      this.router.navigate(['/login']);
    }
  }

}
