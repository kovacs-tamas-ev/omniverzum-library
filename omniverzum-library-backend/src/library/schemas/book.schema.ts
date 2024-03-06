import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Book {
    _id: Types.ObjectId;

    @Prop({ unique: true, required: true })
    inventoryNumber: number;

    @Prop({ unique: true, required: true })
    isbn: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true })
    publisher: string;

    @Prop({ required: true })
    genre: string;

    @Prop({ required: true })
    subjectArea: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);