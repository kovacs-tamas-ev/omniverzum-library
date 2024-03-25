import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportFromFileService } from '../services/import-from-file.service';
import { CreateBookDto } from '../models/book/create-book.dto';

@Controller('upload')
export class UploadController {

    constructor(private importFromFileService: ImportFromFileService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file): Promise<CreateBookDto[]> {
        return await this.importFromFileService.importBooksFromFile(file);
    }

}
