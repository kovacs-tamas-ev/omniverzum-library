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


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TriStateCheckboxModule, CheckboxModule, TableModule, TooltipModule, ConfirmDialogModule, DialogModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [UserService]
})
export class UserListComponent {

  filterForm!: FormGroup;
  userList: UserDto[] = [];
  userDialogVisible = false;

  userForm!: FormGroup;
  isEditing!: boolean;
  dialogHeader!: string;

  constructor(private userService: UserService, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.initForms();
    this.filter();
  }

  private initForms(): void {
    this.filterForm = this.fb.group({
      username: [],
      fullName: [],
      email: [],
      admin: []
    });

    this.userForm = this.fb.group({
      _id: [],
      username: [null, Validators.required],
      password: [null, Validators.required],
      rePassword: [null, Validators.required],
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      admin: [false]
    });
  }

  async filter(): Promise<void> {
    this.userList = await this.userService.findUsers(this.filterForm.value);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filter();
  }

  editUser(user: UserDto): void {
    this.isEditing = true;
    this.dialogHeader = 'Tag szerkesztése';
    this.userForm.get('password')?.disable();
    this.userForm.get('rePassword')?.disable();
    this.userForm.patchValue(user);
    this.userDialogVisible = true;
  }

  showAddUserDialog(): void {
    this.isEditing = false;
    this.dialogHeader = 'Új tag hozzáadása'
    this.userForm.get('password')?.enable();
    this.userForm.get('rePassword')?.enable();
    this.userDialogVisible = true;
  }

  cancel(): void {
    this.userDialogVisible = false;
    this.userForm.reset();
  }

  async saveUser(): Promise<void> {
    if (this.isEditing) {
      await this.userService.updateUser(this.userForm.value);
    } else {
      await this.userService.createUser(this.userForm.value);
    }
    
    this.userDialogVisible = false;
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

  private delete(user: UserDto): void {

  }

}
