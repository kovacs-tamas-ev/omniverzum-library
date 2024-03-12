import { BookEventType } from "./book-event-type";

export class BookEventDto {

    _id: string;
    userId: string;
    bookId: string;
    eventType: BookEventType;
    createdAt: Date;
    dueDate: Date;
    userNotified: boolean;

}