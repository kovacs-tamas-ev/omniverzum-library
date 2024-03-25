import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { FailedBookImportDto } from '../../../models/book/failed-book-import.dto';
import { ServerResponseDto } from '../../../models/server-response.dto';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FileUploadModule, TableModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  providers: [FileUploadService]
})
export class UploadComponent {

  failedImports: FailedBookImportDto[] = [];

  constructor(private fileUploadService: FileUploadService, private messageService: MessageService) {}

  async handleUpload(event: FileUploadHandlerEvent): Promise<void> {
    const response: ServerResponseDto<FailedBookImportDto[]> = await this.fileUploadService.uploadBooksFromFile(event.files[0]);
    if (!response.success) {
      this.messageService.add({ detail: 'A könyvek betöltése nem sikerült', severity: 'error' });
    }
    
    this.failedImports = response.data ?? [];
    if (this.failedImports.length > 0) {
      this.messageService.add({ detail: 'Bizonyos könyvek betöltése sikertelen volt. Az alábbi listán láthatja a részleteket.', severity: 'warn' });
    } else {
      this.messageService.add({ detail: 'A könyvek betöltése sikeres volt.', severity: 'success' });
    }
  }

}
