import { BookEventType } from "./book-event-type";

export class CreateBookEventDto {

    userId: string = undefined;
    bookId: string = undefined;
    eventType: BookEventType = undefined;
    
}