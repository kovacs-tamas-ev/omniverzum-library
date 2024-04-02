import { BookDto } from "../book/book.dto";
import { BookEventType } from "./book-event-type";

export class BookWithEventDto extends BookDto {

    events: BasicBookEventDto[] = [];

}

export class BasicBookEventDto {

    eventType: BookEventType = undefined;
    userId: string = undefined;
    createdAt: Date = undefined;
    dueDate: Date = undefined;

}


export class AdminBookWithEventDto extends BookDto {

    events: AdminBookEventDto[] = [];

}

export class AdminBookEventDto {

    eventType: BookEventType = undefined;
    userId: string = undefined;
    fullName: string = undefined;
    createdAt: Date = undefined;
    dueDate: Date = undefined;
    userNotified: boolean = undefined;

}