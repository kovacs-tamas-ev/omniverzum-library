import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BookDto } from "../../models/book/book.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BookService {

    constructor(private http: HttpClient) {}

    async createOrUpdateBook(book: BookDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/book/create-or-update', book));
    }

    findBooks(filters?: BookDto): Promise<BookDto[]> {
        return firstValueFrom(this.http.post<BookDto[]>('/api/book/find', filters));
    }

    async deleteBook(book: BookDto): Promise<void> {
        await firstValueFrom(this.http.delete(`/api/book/${book._id}`));
    }

}