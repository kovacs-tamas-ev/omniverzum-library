import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isBefore } from 'date-fns';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { BookEventType } from '../../../models/book-event/book-event-type';
import { AdminBookWithEventDto } from '../../../models/book-event/book-with-event.dto';
import { DisplayAdminBookWithEventDto } from '../../../models/book-event/display-admin-book-with-event.dto';
import { dateFormat } from '../../../utils/constants';
import { BookEventService } from '../../services/book-event.service';
import { BookService } from '../../services/book.service';
import { TooltipModule } from 'primeng/tooltip';
import { UserDto } from '../../../models/user/user.dto';
import { UserService } from '../../../user/services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-book-with-event-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, AutoCompleteModule, ButtonModule, TableModule, TooltipModule, CheckboxModule],
  templateUrl: './admin-book-with-event-list.component.html',
  styleUrl: './admin-book-with-event-list.component.scss'
})
export class AdminBookWithEventListComponent {

  filterForm!: FormGroup;
  bookWithEventsAndUsers: DisplayAdminBookWithEventDto[] = [];
  dateFormat = dateFormat;

  allUserSuggestions: UserDto[] = [];
  filteredUserSuggestions: UserDto[] = [];

  @ViewChild('userAutoComplete') userAutoComplete!: AutoComplete;

  constructor(private fb: FormBuilder,
              private bookService: BookService,
              private userService: UserService,
              private authService: AuthService,
              private confirmationService: ConfirmationService,
              private bookEventService: BookEventService,
              private http: HttpClient, // Just for the demo, remove it after
              private messageService: MessageService) {
    this.initForm();
    this.initUserSuggestions();
    this.filter();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      title: [null],
      author: [null],
      userId: [null],
      overDue: [null]
    });
  }

  private async initUserSuggestions(): Promise<void> {
    const allUsers = await this.userService.findUsers();
    const loggedInUser = this.authService.getUserData();
    this.allUserSuggestions = allUsers.filter(user => user._id !== loggedInUser?._id);
    this.filteredUserSuggestions = [ ...this.allUserSuggestions ];
  }

  async filter(): Promise<void> {
    const booksWithEvents = await this.bookService.findBooksWithEventAndUser(this.filterForm.value);
    this.bookWithEventsAndUsers = booksWithEvents.map(bookWithEvent => this.toDisplayFormat(bookWithEvent));
  }

  private toDisplayFormat(adminBookWithEventDto: AdminBookWithEventDto): DisplayAdminBookWithEventDto {
    const borrowEvent = adminBookWithEventDto.events.find(event => event.eventType === BookEventType.BORROW);
    const reserveEvent = adminBookWithEventDto.events.find(event => event.eventType === BookEventType.RESERVE);
    return {
      bookId: adminBookWithEventDto._id,
      title: adminBookWithEventDto.title,
      author: adminBookWithEventDto.author,
      isBorrowed: borrowEvent !== undefined,
      borrowUserId: borrowEvent?.userId ?? '-',
      borrowUserFullName: borrowEvent?.fullName ?? '-',
      borrowedAt: borrowEvent?.createdAt !== undefined ? new Date(borrowEvent?.createdAt) : undefined,
      dueDate: borrowEvent?.dueDate !== undefined ? new Date(borrowEvent?.dueDate) : undefined,
      userNotified: borrowEvent?.userNotified ?? false,
      isReserved: reserveEvent !== undefined,
      reserveUserId: reserveEvent?.userId ?? '-',
      reserveUserFullName: reserveEvent?.fullName ?? '-'
    };
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.userAutoComplete.clear();
    this.filter();
  }

  isOverDueDate(row: DisplayAdminBookWithEventDto): boolean {
    if (row.dueDate === undefined) {
      return false;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0);
    startOfToday.setMinutes(0);
    startOfToday.setSeconds(0);
    startOfToday.setMilliseconds(0);

    return isBefore(row.dueDate, startOfToday);
  }

  filterUsers(event: any): void {
    const query = event.query as string;
    this.filteredUserSuggestions = this.allUserSuggestions.filter(user => user.fullName.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }

  handleUserSelected(event: any): void {
    const selectedUser = event.value;
    this.filterForm.patchValue({ userId: selectedUser._id });
  }

  handleOnBlur(): void {
    const inputValue = this.userAutoComplete.inputValue();
    if (inputValue === null || inputValue === undefined || inputValue === '') {
      this.filterForm.patchValue({ userId: undefined });
    }
  }

  confirmReturnBook(book: DisplayAdminBookWithEventDto): any {
    this.confirmationService.confirm({
      header: 'Visszavétel megerősítése',
      message: `Biztosan visszavezi a <strong>${book.borrowUserFullName}</strong> nál kintlévő <strong>${book.author}: ${book.title}</strong> című könyvet?`,
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => this.returnBook(book)
    });
  }

  async returnBook(book: DisplayAdminBookWithEventDto): Promise<void> {
    await this.bookEventService.returnBookFor({ userId: book.borrowUserId, bookId: book.bookId });
    this.filter();
    this.messageService.add({ detail: `A <strong>${book.author}: ${book.title}</strong> című könyvet sikeresen visszavette <strong>${book.borrowUserFullName}</strong> tól.`, severity: 'success' });
  }

  confirmCancelReservation(book: DisplayAdminBookWithEventDto): any {
    this.confirmationService.confirm({
      header: 'Foglalás törlésének megerősítése',
      message: `Biztosan törli <strong>${book.reserveUserFullName}</strong> foglalását a <strong>${book.author}: ${book.title}</strong> című könyvre?`,
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => this.cancelReservation(book)
    });
  }

  async cancelReservation(book: DisplayAdminBookWithEventDto): Promise<void> {
    await this.bookEventService.cancelReservationFor({ userId: book.reserveUserId, bookId: book.bookId });
    this.filter();
    this.messageService.add({ detail: `<strong>${book.reserveUserFullName}</strong> foglalásást sikeresen törölte a <strong>${book.author}: ${book.title}</strong> című könyvre.`, severity: 'success' });
  }

  // Demo methods
  async sendOverdueMails(): Promise<void> {
    await firstValueFrom(this.http.get('api/email/send-overdue'));
    this.filter();
  }

  async sendReserveAvailableMails(): Promise<void> {
    await firstValueFrom(this.http.get('api/email/send-reserve-available'));
    this.filter();
  }


}
