import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Omniverzum-könyvtár';

  constructor(private http: HttpClient) {
    this.http.post('/api/auth/login', { username: 'testUser3', password: 'password3' }).subscribe({
      next: resp => {
        console.log('-- in next --\n', resp);
      },
      error: error => {
        console.log('-- in error --\n', error);
      }
    });
  }

}
