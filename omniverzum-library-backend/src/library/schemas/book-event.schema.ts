import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BookEventType } from "../models/book-event/book-event-type";

@Schema()
export class BookEvent {

    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
    bookId: Types.ObjectId;

    @Prop({ type: String, enum: Object.values(BookEventType), required: true })
    eventType: BookEventType;

    @Prop({ required: true })
    createdAt: Date;

    @Prop()
    dueDate: Date;

    @Prop({ default: false })
    userNotified: boolean;

}

export const BookEventSchema = SchemaFactory.createForClass(BookEvent);