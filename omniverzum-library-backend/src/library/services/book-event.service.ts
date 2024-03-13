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



    async createBookEvent(tokenUserIdStr: string, createBookEventDto: CreateBookEventDto): Promise<void> {
        await this.validateCreateBookEventData(tokenUserIdStr, createBookEventDto);
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
        if (createBookEventDto.eventType === BookEventType.BORROW) {
            this.cancelReservationIfPresent(tokenUserIdStr, createBookEventDto.bookId);
        }
    }

    private async validateCreateBookEventData(tokenUserIdStr: string, createBookEventDto: CreateBookEventDto): Promise<void> {
        const tokenUserId = new mongoose.Types.ObjectId(tokenUserIdStr);
        const filterQuery = {} as FilterQuery<BookEvent>;
        filterQuery.bookId = new mongoose.Types.ObjectId(createBookEventDto.bookId);
        const resultDocs = await this.bookEventModel.find(filterQuery).exec();
        const resultObjects = resultDocs.map(doc => doc.toObject());

        const hasOthersBorrowEvent = resultObjects.some(event => event.eventType === BookEventType.BORROW && !event.userId.equals(tokenUserId));
        const hasOthersReserveEvent = resultObjects.some(event => event.eventType === BookEventType.RESERVE && !event.userId.equals(tokenUserId));
        const hasMyBorrowEvent = resultObjects.some(event => event.eventType === BookEventType.BORROW && event.userId.equals(tokenUserId));
        const hasMyReserveEvent = resultObjects.some(event => event.eventType === BookEventType.RESERVE && event.userId.equals(tokenUserId));

        if (hasOthersReserveEvent) {
            throw new ServerException({ message: 'A kívánt könyvet valaki más már lefoglalta, így jelenleg se kivenni, se lefoglalni nem lehet.' });
        }
        if (hasMyBorrowEvent) {
            throw new ServerException({ message: 'A kívánt könyvet Ön már kivette, így se lefoglalni, se újra kivenni nem tudja.' });
        }

        if (createBookEventDto.eventType === BookEventType.BORROW) {
            if (hasOthersBorrowEvent) {
                throw new ServerException({ message: 'A kívánt könyvet már kivették, így amív vissza nem hozzák, csak lefoglalni tudja.' });
            }
        } else if (createBookEventDto.eventType === BookEventType.RESERVE) {
            if (hasMyReserveEvent) {
                throw new ServerException({ message: 'A kívánt könyvre már van egy aktív foglalása.' });
            }
        }
    }

    async cancelReservationIfPresent(userId: string, bookId: string): Promise<void> {
        const filterQuery = {} as FilterQuery<BookEvent>;
        filterQuery.userId = new mongoose.Types.ObjectId(userId);
        filterQuery.bookId = new mongoose.Types.ObjectId(bookId);
        filterQuery.eventType = BookEventType.RESERVE;
        await this.bookEventModel.deleteOne(filterQuery);
    }

}