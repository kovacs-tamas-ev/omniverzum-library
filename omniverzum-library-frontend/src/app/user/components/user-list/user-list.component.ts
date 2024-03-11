import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { UserService } from '../../services/user.service';
import { TableModule } from 'primeng/table';
import { UserDto } from '../../../models/user/user.dto';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../../auth/services/auth.service';
import { markControlsAsTouchedAndDirty } from '../../../utils/form-utils';
import { DateFilterComponent } from '../../../shared/date-filter/date-filter.component';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TriStateCheckboxModule, CheckboxModule, TableModule, TooltipModule, ConfirmDialogModule, DialogModule, DateFilterComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  filterForm!: FormGroup;
  userList: UserDto[] = [];
  userDialogVisible = false;

  userForm!: FormGroup;
  isEditing!: boolean;
  dialogHeader!: string;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private confirmationService: ConfirmationService,
              private authService: AuthService) {
    this.initForms();
    this.filter();
  }

  private initForms(): void {
    this.filterForm = this.fb.group({
      username: [],
      fullName: [],
      email: [],
      course: [],
      membershipStart: [],
      admin: []
    });

    this.userForm = this.fb.group({
      _id: [],
      username: [null, Validators.required],
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      course: [null, Validators.required],
      admin: [false, Validators.required]
    });
  }

  async filter(): Promise<void> {
    this.userList = await this.userService.findUsers(this.filterForm.value);
    const ownData = this.authService.getUserData()!;
    this.userList = this.userList.filter(user => user._id !== ownData._id);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filter();
  }

  showEditUserDialog(user: UserDto): void {
    this.resetUserForm();
    this.isEditing = true;
    this.dialogHeader = 'Tag szerkesztése';
    this.userForm.get('username')?.enable();
    this.userForm.patchValue(user);
    this.userDialogVisible = true;
  }

  showAddUserDialog(): void {
    this.resetUserForm();
    this.isEditing = false;
    this.dialogHeader = 'Új tag hozzáadása';
    this.userForm.get('username')?.disable();
    this.userDialogVisible = true;
  }

  cancel(): void {
    this.userDialogVisible = false;
  }

  async saveUser(): Promise<void> {
    if (!this.userForm.valid) {
      markControlsAsTouchedAndDirty(this.userForm);
      return;
    }

    if (this.isEditing) {
      const { password, rePassword, ...userDto } = this.userForm.value;
      await this.userService.updateUser(userDto);
    } else {
      const { _id, rePassword, ...createUserDto } = this.userForm.value;
      await this.userService.createUser(createUserDto);
    }
    
    this.userDialogVisible = false;
    this.filter();
  }

  confirmResetUserData(user: UserDto): void {
    this.confirmationService.confirm({
      header: 'Visszaállítás megerősítése',
      message: `Biztosan szereté visszaállítani a felhasználónév és jelszó mezőket az e-mail címre "<strong>${user.fullName}</strong> (<strong>${user.username}</strong>)" számára?`,
      acceptLabel: 'Igen',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-outlined',
      accept: () => this.resetUserData(user),
      rejectLabel: 'Nem',
      rejectIcon: 'pi pi-times'
    });
  }

  async resetUserData(user: UserDto): Promise<void> {
    await this.userService.resetUserData(user);
    this.filter();
  }

  confirmDelete(user: UserDto): void {
    this.confirmationService.confirm({
      header: 'Törlés megerősítése',
      message: `Biztosan szereté törölni "<strong>${user.fullName}</strong> (<strong>${user.username}</strong>)" tagságát?`,
      acceptLabel: 'Igen',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-outlined',
      accept: () => this.delete(user),
      rejectLabel: 'Nem',
      rejectIcon: 'pi pi-times'
    });
  }

  private async delete(user: UserDto): Promise<void> {
    await this.userService.deleteUser(user);
    this.filter();
  }

  private resetUserForm(): void {
    this.userForm.reset();
    this.userForm.patchValue({ admin: false });
  }

}
