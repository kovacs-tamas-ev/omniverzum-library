import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async login() {
    await this.authService.login({ username: this.form.value.username, password: this.form.value.password });
    this.router.navigate(['/profile']);
  }

}
