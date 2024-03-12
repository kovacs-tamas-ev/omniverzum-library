import { BookDto } from "../book/book.dto";
import { BookEventType } from "./book-event-type";

export class BookWithEventDto {

    book: BookDto = undefined;
    events: BasicBookEventDto[] = [];

}

export class BasicBookEventDto {

    eventType: BookEventType = undefined;
    userId: string = undefined;

}