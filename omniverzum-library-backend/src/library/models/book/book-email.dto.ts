import { BookEventType } from "../book-event/book-event-type";

export class BookEmailDto {

    author: string;
    title: string;
    userFullName: string;
    eventType: BookEventType;
    targetEmail: string;

}