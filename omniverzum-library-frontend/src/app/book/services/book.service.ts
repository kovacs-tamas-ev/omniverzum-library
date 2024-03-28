import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BookDto } from "../../models/book/book.dto";
import { firstValueFrom } from "rxjs";
import { AdminBookWithEventDto, BookWithEventDto } from "../../models/book-event/book-with-event.dto";
import { BookWithEventFiltersDto } from "../../models/book-event/book-with-event-filters.dto";
import { AdminBookWithEventFiltersDto } from "../../models/book-event/admin-book-with-event-filters.dto";

@Injectable({
    providedIn: 'root'
})
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

    async findBooksWithEvents(filters?: BookWithEventFiltersDto): Promise<BookWithEventDto[]> {
        return firstValueFrom(this.http.post<BookWithEventDto[]>('/api/book/find-with-event', filters));
    }

    async findBooksWithEventAndUser(filters: AdminBookWithEventFiltersDto): Promise<AdminBookWithEventDto[]> {
        return firstValueFrom(this.http.post<AdminBookWithEventDto[]>('api/book/find-with-event-and-user', filters));
    }



}