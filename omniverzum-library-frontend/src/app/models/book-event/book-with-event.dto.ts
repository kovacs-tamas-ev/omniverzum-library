import { BookDto } from "../book/book.dto";
import { BookEventType } from "./book-event-type";

export interface BookWithEventDto extends BookDto {

    events: BasicBookEventDto[];

}

export interface BasicBookEventDto {

    eventType: BookEventType;
    userId: string;

}

export interface AdminBookWithEventDto extends BookDto {

    events: AdminBookEventDto[];

}

export interface AdminBookEventDto {

    eventType: BookEventType;
    userId: string;
    fullName: string;
    createdAt: Date;
    dueDate: Date;
    userNotified: boolean;

}