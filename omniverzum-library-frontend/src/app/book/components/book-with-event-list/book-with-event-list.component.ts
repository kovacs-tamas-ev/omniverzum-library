import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { BookService } from '../../services/book.service';
import { DisplayBookWithEventDto } from '../../../models/book-event/display-book-with-event.dto';
import { BookWithEventDto } from '../../../models/book-event/book-with-event.dto';
import { AuthService } from '../../../auth/services/auth.service';
import { BookEventType } from '../../../models/book-event/book-event-type';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-with-event-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule, ButtonModule, TableModule, TriStateCheckboxModule, TooltipModule],
  templateUrl: './book-with-event-list.component.html',
  styleUrl: './book-with-event-list.component.scss'
})
export class BookWithEventListComponent {

  filterForm!: FormGroup;
  bookWithEventsList: DisplayBookWithEventDto[] = [];

  constructor(private fb: FormBuilder, private bookService: BookService, private authService: AuthService) {
    this.initForm();
    this.filter();
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      bookFilters: this.fb.group({
        inventoryNumber: [null],
        title: [null],
        author: [null],
        isbn: [null],
        publisher: [null],
        genre: [null],
        subjectArea: [null],  
      }),
      myEvents: [null]
    });
  }

  async filter(): Promise<void> {
    const booksWithEvents = await this.bookService.findBooksWithEvents(this.filterForm.value);
    this.bookWithEventsList = booksWithEvents.map(bookWithEvent => this.bookWithEventsToDisplayFormat(bookWithEvent));
  }

  private bookWithEventsToDisplayFormat(bookWithEvent: BookWithEventDto): DisplayBookWithEventDto {
    const tokenUserId = this.authService.getUserData()!._id;
    return {
      ...bookWithEvent.book,
      state: {
        myBorrowed: bookWithEvent.events.some(event => event.eventType === BookEventType.BORROW && event.userId === tokenUserId),
        myReserved: bookWithEvent.events.some(event => event.eventType === BookEventType.RESERVE && event.userId === tokenUserId),
        othersBorrowed: bookWithEvent.events.some(event => event.eventType === BookEventType.BORROW && event.userId !== tokenUserId),
        othersReserved: bookWithEvent.events.some(event => event.eventType === BookEventType.RESERVE && event.userId !== tokenUserId),
      }
    };
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filter();
  }

}
