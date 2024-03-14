import { BookEventType } from "./book-event-type";

export interface CreateBookEventDto {

    userId: string;
    bookId: string;
    eventType: BookEventType;
    
}