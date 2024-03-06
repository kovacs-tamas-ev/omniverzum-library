import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BookDto } from "../../models/book/book.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BookService {

    constructor(private http: HttpClient) {}

    findBooks(filters?: BookDto): Promise<BookDto[]> {
        return firstValueFrom(this.http.post<BookDto[]>('/api/book/find', filters));
    }

}