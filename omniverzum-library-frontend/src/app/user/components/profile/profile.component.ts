import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { AuthService } from '../../../auth/services/auth.service';
import { UserDto } from '../../../models/user/user.dto';
import { connectControlsValidation, markControlsAsTouchedAndDirty } from '../../../utils/form-utils';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ErrorDisplayerComponent } from '../../../shared/error-displayer/error-displayer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, TabViewModule, InputTextModule, PasswordModule, ButtonModule, CalendarModule, ErrorDisplayerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  userData: UserDto;
  basicDataForm!: FormGroup;
  passwordForm!: FormGroup;
  deleteProfileForm!: FormGroup;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private confirmationService: ConfirmationService,
              private userService: UserService,
              private messageService: MessageService,
              private router: Router) {
    this.userData = this.authService.getUserData()!;
    this.initForms();
  }

  private initForms(): void {
    this.basicDataForm = this.fb.group({
      username: [this.userData.username, Validators.required],
      fullName: [this.userData.fullName, Validators.required],
      email: [this.userData.email, Validators.required],
      course: [{ value: this.userData.course, disabled: true }],
      membershipStart: [{ value: this.userData.membershipStart, disabled: true }]
    });
    this.passwordForm = this.fb.group({
      oldPassword: [null, [Validators.required, connectControlsValidation('password', 'NOT_EQUAL', 'A régi és az új jelszó nem egyezhet meg')]],
      password: [null, [
                          Validators.required,
                          connectControlsValidation('rePassword', 'EQUAL', 'Az új jelszó és a megismétlése nem egyező'),
                          connectControlsValidation('oldPassword', 'NOT_EQUAL', 'A régi és az új jelszó nem egyezhet meg')]
                      ],
      rePassword: [null, [Validators.required, connectControlsValidation('password', 'EQUAL', 'Az új jelszó és a megismétlése nem egyező')]]
    });
    this.deleteProfileForm = this.fb.group({
      password: [null, Validators.required]
    });
  }

  async changeBasicData(): Promise<void> {
    await this.userService.modifyOwnData(this.basicDataForm.value);
    this.messageService.add({ detail: 'Az alapadatok módosítása sikeres', severity: 'success' });
  }

  async changePassword(): Promise<void> {
    if (!this.passwordForm.valid) {
      markControlsAsTouchedAndDirty(this.passwordForm);
      return;
    }

    await this.userService.changePassword(this.passwordForm.value);
    this.passwordForm.reset();
    this.messageService.add({ detail: 'A jelszó megváltoztatása sikeres', severity: 'success' });
  }

  confirmDeleteProfile(): void {
    if (!this.deleteProfileForm.valid) {
      markControlsAsTouchedAndDirty(this.deleteProfileForm);
      return;
    }
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
    await this.userService.deleteOwnProfile(this.deleteProfileForm.value.password as string);
    this.messageService.add({ detail: 'A felhasználói fiókját sikeresen töröltük', severity: 'success', sticky: true });
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
