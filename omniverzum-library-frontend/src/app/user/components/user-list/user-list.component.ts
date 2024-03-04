import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TriStateCheckboxModule, TableModule, TooltipModule, ConfirmDialogModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [UserService]
})
export class UserListComponent {

  form!: FormGroup;
  userList: UserDto[] = [];

  constructor(private userService: UserService, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.initForm();
    this.filter();
  }

  private initForm(): void {
    this.form = this.fb.group({
      username: [],
      fullName: [],
      email: [],
      admin: []
    });
  }

  async filter(): Promise<void> {
    this.userList = await this.userService.findUsers(this.form.value);
  }

  resetFilters(): void {
    this.form.patchValue({
      _id: null,
      username: null,
      fullName: null,
      email: null,
      admin:null
    });
    this.filter();
  }

  confirmDelete(user: UserDto): void {
    console.log('belépett, user:\n', user);
    
    this.confirmationService.confirm({
      header: 'Törlés megerősítése',
      message: `Biztosan szereté törölni "<strong>${user.fullName}</strong> (<strong>${user.username}</strong>)" tagságát?`,
      acceptLabel: 'Igen',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-outlined',
      rejectLabel: 'Nem',
      rejectIcon: 'pi pi-times'
    });
  }

  private delete(): void {

  }

}
