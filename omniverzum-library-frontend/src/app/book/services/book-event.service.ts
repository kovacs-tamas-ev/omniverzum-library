import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { BookAndUserDto } from "../../models/book-event/book-and-user.dto";

@Injectable({
    providedIn: 'root'
})
export class BookEventService {

    constructor(private http: HttpClient) {}

    async borrow(bookId: string): Promise<void> {
        await firstValueFrom(this.http.post(`/api/book-event/borrow/${bookId}`, {}));
    }

    async returnBook(bookId: string): Promise<void> {
        await firstValueFrom(this.http.post(`/api/book-event/return/${bookId}`, {}));
    }

    async reserve(bookId: string): Promise<void> {
        await firstValueFrom(this.http.post(`/api/book-event/reserve/${bookId}`, {}));
    }

    async cancelReservation(bookId: string): Promise<void> {
        await firstValueFrom(this.http.post(`/api/book-event/cancel-reservation/${bookId}`, {}));
    }

    async returnBookFor(bookAndUserDto: BookAndUserDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/book-event/return-for', bookAndUserDto));
    }

    async cancelReservationFor(bookAndUserDto: BookAndUserDto): Promise<void> {
        await firstValueFrom(this.http.post('/api/book-event/cancel-reservation-for', bookAndUserDto));
    }

}