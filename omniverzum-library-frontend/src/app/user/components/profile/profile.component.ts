import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { UserDto } from '../../../models/user/user.dto';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { connectControlsValidation } from '../../../utils/form-utils';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  userData: UserDto;
  basicDataForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.userData = this.authService.getUserData()!;
    this.initForms();
  }

  private initForms(): void {
    this.basicDataForm = this.fb.group({
      username: [this.userData.username, Validators.required],
      fullName: [this.userData.fullName, Validators.required],
      email: [this.userData.email, Validators.required]
    });
    this.passwordForm = this.fb.group({
      password: [null, [Validators.required, connectControlsValidation('rePassword')]],
      rePassword: [null, [Validators.required, connectControlsValidation('password')]]
    });
  }

  async changeBasicData(): Promise<void> {

  }

  async changePassword(): Promise<void> {

  }

  confirmDeleteProfile(): void {
    this.confirmationService.confirm({
      header: 'Törlés megerősítése',
      message: 'Biztosan szeretné törölni a felhasználói fiókját? A törlés végleges és nem visszaállítható.',
      acceptLabel: 'Igen',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-outlined',
      accept: () => this.deleteProfile(),
      rejectLabel: 'Nem',
      rejectIcon: 'pi pi-times'
    });
  }

  async deleteProfile(): Promise<void> {
    
  }

}
