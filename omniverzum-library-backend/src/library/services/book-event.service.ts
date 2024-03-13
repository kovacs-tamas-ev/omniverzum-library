import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { addDays } from "date-fns";
import mongoose, { FilterQuery, Model } from "mongoose";
import { nullOutTimePart } from "src/utils/date-utils";
import { CreateBookEventDto } from "../models/book-event/create-book-event.dto";
import { BookEvent } from "../schemas/book-event.schema";
import { BookEventType } from "../models/book-event/book-event-type";
import { ServerException } from "../models/general/server-exception";

@Injectable()
export class BookEventService {

    constructor(@InjectModel(BookEvent.name) private bookEventModel: Model<BookEvent>) {}

    async createBookEvent(createBookEventDto: CreateBookEventDto): Promise<void> {
        await this.validateCreateBookEventData(createBookEventDto);
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

    private async validateCreateBookEventData(createBookEventDto: CreateBookEventDto): Promise<void> {
        const filterQuery = {} as FilterQuery<BookEvent>;
        filterQuery.bookId = new mongoose.Types.ObjectId(createBookEventDto.bookId);
        const resultDocs = await this.bookEventModel.find(filterQuery).exec();
        const resultObjects = resultDocs.map(doc => doc.toObject());

        const hasBorrowEvent = resultObjects.some(event => event.eventType === BookEventType.BORROW);
        const hasReserveEvent = resultObjects.some(event => event.eventType === BookEventType.RESERVE);

        if (hasReserveEvent) {
            throw new ServerException({ message: 'A kívánt könyvre már van aktív foglalás, így jelenleg se kivenni, se lefoglalni nem lehet.' });
        }
        if (hasBorrowEvent) {
            if (createBookEventDto.eventType === BookEventType.BORROW) {
                throw new ServerException({ message: 'A kívánt könyvet már kivették, így amív vissza nem hozzák, csak lefoglalni lehet.' });
            }
        }
    }

}