import { Injectable } from "@nestjs/common";
import { UploadedFile } from 'multer';
import { CreateBookDto } from "../models/book/create-book.dto";
import { FailedBookImportDto } from "../models/book/failed-book-import.dto";
import { ImportBookDto } from "../models/book/import-book.dto";
import { BookService } from "./book.service";

@Injectable()
export class ImportFromFileService {

    constructor(private bookService: BookService) {}

    async importBooksFromFile(file: UploadedFile): Promise<FailedBookImportDto[]> {
        const xls = require('xlsx');
        const workbook = xls.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importBooks = xls.utils.sheet_to_json(sheet) as ImportBookDto[];
        
        const createBookDtos = importBooks.map(this.toCreateBookDto);
        const failedImports: FailedBookImportDto[] = [];
        for (let createBookDto of createBookDtos) {
            try {
                await this.bookService.createOrUpdateBook(createBookDto);
            } catch(error) {
                let errorMessage = error.message as string;
                if (errorMessage.includes('duplicate')) {
                    const duplicateValues = Object.keys(error.keyValue)
                        .map(key => `${key}: ${error.keyValue[key]}`)
                        .join(', ');
                    errorMessage = `Duplikált érték: ${duplicateValues}`
                }
                failedImports.push({ 
                    ...createBookDto,
                    errorMessage
                 });
            }
        }

        return failedImports;
    }

    private toCreateBookDto(importBook: ImportBookDto): CreateBookDto {
        return {
            inventoryNumber: +importBook['Leltári szám'],
            author: importBook['Szerző'],
            title: importBook['Cím'],
            isbn: importBook.ISBN,
            publisher: importBook['Kiadó'],
            genre: importBook['Műfaj'],
            subjectArea: importBook['Tárgykör']
        };
    }

}