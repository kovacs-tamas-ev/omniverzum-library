import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { nullOutTimePart } from "src/utils/date-utils";
import { CreateBookEventDto } from "../models/book-event/create-book-event.dto";
import { BookEvent } from "../schemas/book-event.schema";
import { addDays } from "date-fns";
import { BookEventDto } from "../models/book-event/book-event.dto";

@Injectable()
export class BookEventService {

    constructor(@InjectModel(BookEvent.name) private bookEventModel: Model<BookEvent>) {}

    async createBookEvent(createBookEventDto: CreateBookEventDto): Promise<void> {
        const createdAt = nullOutTimePart(new Date());
        const dueDate = addDays(createdAt, 30);
        const userNotified = false;
        const bookId = new mongoose.Types.ObjectId(createBookEventDto.bookId);
        const userId = new mongoose.Types.ObjectId(createBookEventDto.userId);

        const dtoToSave = {
            bookId,
            userId,
            eventType: createBookEventDto.eventType,
            createdAt,
            dueDate,
            userNotified
        };

        const newBookEvent = new this.bookEventModel(dtoToSave);
        await newBookEvent.save();
    }

}