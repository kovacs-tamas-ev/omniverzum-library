import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, TriStateCheckboxModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [UserService]
})
export class UserListComponent {

  form!: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      _id: [],
      username: [],
      fullName: [],
      email: [],
      admin: []
    });
  }

  filter(): void {
    this.userService.findUsers(this.form.value);
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

}
