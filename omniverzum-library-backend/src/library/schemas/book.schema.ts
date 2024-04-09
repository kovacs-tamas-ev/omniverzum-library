import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Book {
    _id: Types.ObjectId;

    @Prop({ unique: true, required: true })
    inventoryNumber: number;

    @Prop()
    isbn: string;

    @Prop()
    title: string;

    @Prop()
    author: string;

    @Prop()
    publisher: string;

    @Prop()
    genre: string;

    @Prop()
    subjectArea: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);