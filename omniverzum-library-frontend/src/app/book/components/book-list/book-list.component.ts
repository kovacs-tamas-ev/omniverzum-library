import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BookDto } from '../../../models/book/book.dto';
import { markControlsAsTouchedAndDirty } from '../../../utils/form-utils';
import { BookService } from '../../services/book.service';
import { UploadComponent } from '../upload/upload.component';
import { ErrorDisplayerComponent } from '../../../shared/error-displayer/error-displayer.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, ConfirmDialogModule, DialogModule, InputNumberModule, UploadComponent, ErrorDisplayerComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {

  filterForm!: FormGroup;
  bookList: BookDto[] = [];

  bookDialogVisible = false;
  bookForm!: FormGroup;
  isEditing!: boolean;
  dialogHeader!: string;

  constructor(private fb: FormBuilder,
              private bookService: BookService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
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
    this.isEditing = false;
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
    const successMessage = this.isEditing
      ? `A(z) <strong>${this.bookForm.value.title}</strong> című könyv adatait sikeresen módosítottuk`
      : `A(z) <strong>${this.bookForm.value.title}</strong> című könyvet sikeresen felvettük az adatbázisba`;
    this.messageService.add({ detail: successMessage, severity: 'success' });
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
    this.messageService.add({ detail: `A(z) <strong>${book.title}</strong> című könyvet sikeresen töröltük`, severity: 'success' });
    this.filter();
  }


}
