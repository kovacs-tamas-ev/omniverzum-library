import mongoose from "mongoose";
import { BookEventType } from "../book-event/book-event-type";

export class BookEmailDto {

    _id: mongoose.Types.ObjectId = undefined;
    author: string = undefined;
    title: string = undefined;
    userFullName: string = undefined;
    eventType: BookEventType = undefined;
    targetEmail: string = undefined;

}