import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BookDto } from '../../../models/book/book.dto';
import { markControlsAsTouchedAndDirty } from '../../../utils/form-utils';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, ConfirmDialogModule, DialogModule, InputNumberModule, FieldsetModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  providers: [BookService]
})
export class BookListComponent {

  filterForm!: FormGroup;
  bookList: BookDto[] = [];

  bookDialogVisible = false;
  bookForm!: FormGroup;
  isEditing!: boolean;
  dialogHeader!: string;

  constructor(private fb: FormBuilder, private bookService: BookService, private confirmationService: ConfirmationService) {
    this.initForms();
    this.filter();
  }

  private initForms(): void {
    this.filterForm = this.fb.group({
      inventoryNumber: [null],
      title: [null],
      author: [null],
      isbn: [null],
      publisher: [null],
      genre: [null],
      subjectArea: [null],
    });

    this.bookForm = this.fb.group({
      _id: [null],
      inventoryNumber: [null, Validators.required],
      title: [null, Validators.required],
      author: [null, Validators.required],
      isbn: [null],
      publisher: [null],
      genre: [null],
      subjectArea: [null],      
    });
  }

  async filter(): Promise<void> {
    this.bookList = await this.bookService.findBooks(this.filterForm.value);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filter();
  }

  showAddBookDialog(): void {
    this.bookForm.reset();
    this.isEditing = true;
    this.dialogHeader = 'Új könyv hozzáadása';
    this.bookDialogVisible = true;
  }

  showEditBookDialog(book: BookDto): void {
    this.bookForm.reset();
    this.isEditing = true;
    this.dialogHeader = 'Könyv szerkesztése';
    this.bookForm.patchValue(book);
    this.bookDialogVisible = true;
  }

  cancel(): void {
    this.bookDialogVisible = false;
  }

  async saveBook(): Promise<void> {
    if (!this.bookForm.valid) {
      markControlsAsTouchedAndDirty(this.bookForm);
      return;
    }

    await this.bookService.createOrUpdateBook(this.bookForm.value);
    this.bookDialogVisible = false;
    this.filter();
  }

  confirmDelete(book: BookDto): void {
    this.confirmationService.confirm({
      header: 'Törlés megerősítése',
      message: `Biztosan szereté törölni a(z) "<strong>${book.author} - ${book.title}</strong> című könyvet?`,
      acceptLabel: 'Igen',
      acceptIcon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-outlined',
      accept: () => this.delete(book),
      rejectLabel: 'Nem',
      rejectIcon: 'pi pi-times'
    });
  }

  async delete(book: BookDto): Promise<void> {
    await this.bookService.deleteBook(book);
    this.filter();
  }


}
