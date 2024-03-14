import { BookDto } from "../book/book.dto";
import { BookEventType } from "./book-event-type";

export interface BookWithEventDto extends BookDto {

    events: BasicBookEventDto[];

}

export interface BasicBookEventDto {

    eventType: BookEventType;
    userId: string;

}