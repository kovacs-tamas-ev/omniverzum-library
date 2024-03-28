import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isBefore } from 'date-fns';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { BookEventType } from '../../../models/book-event/book-event-type';
import { AdminBookWithEventDto } from '../../../models/book-event/book-with-event.dto';
import { DisplayAdminBookWithEventDto } from '../../../models/book-event/display-admin-book-with-event.dto';
import { dateFormat } from '../../../utils/constants';
import { BookEventService } from '../../services/book-event.service';
import { BookService } from '../../services/book.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin-book-with-event-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule],
  templateUrl: './admin-book-with-event-list.component.html',
  styleUrl: './admin-book-with-event-list.component.scss'
})
export class AdminBookWithEventListComponent {

  filterForm!: FormGroup;
  bookWithEventsAndUsers: DisplayAdminBookWithEventDto[] = [];
  dateFormat = dateFormat;

  constructor(private fb: FormBuilder,
              private bookService: BookService,
              private bookEventService: BookEventService,
              private messageService: MessageService) {
    this.initForm();
    this.filter();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      title: [null],
      author: [null],
      userId: [null],
    });
  }

  async filter(): Promise<void> {
    const booksWithEvents = await this.bookService.findBooksWithEventAndUser(this.filterForm.value);
    this.bookWithEventsAndUsers = booksWithEvents.map(bookWithEvent => this.toDisplayFormat(bookWithEvent));
  }

  private toDisplayFormat(adminBookWithEventDto: AdminBookWithEventDto): DisplayAdminBookWithEventDto {
    const borrowEvent = adminBookWithEventDto.events.find(event => event.eventType === BookEventType.BORROW);
    const reserveEvent = adminBookWithEventDto.events.find(event => event.eventType === BookEventType.RESERVE);
    return {
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

    return isBefore(row.dueDate, startOfToday);
  }


}
