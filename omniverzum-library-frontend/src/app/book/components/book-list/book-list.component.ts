import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BookDto } from '../../../models/book/book.dto';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, ConfirmDialogModule, DialogModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  providers: [BookService]
})
export class BookListComponent {

  filterForm!: FormGroup;
  bookList: BookDto[] = [];

  constructor(private bookService: BookService) {
    this.filter();
  }

  async filter(): Promise<void> {
    this.bookList = await this.bookService.findBooks();
    console.log('book list\n', this.bookList);
    
  }

}
