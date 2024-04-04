import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { nullOutTimePart } from "src/utils/date-utils";
import { BookEventType } from "../models/book-event/book-event-type";
import { BookEmailDto } from "../models/book/book-email.dto";
import { BookEvent } from "../schemas/book-event.schema";
import { EmailService } from "./email.service";
import { mapAllToClass } from "src/utils/mappers";

@Injectable()
export class BookEventAutomailService {

    constructor(@InjectModel(BookEvent.name) private bookEventModel: Model<BookEvent>, private emailService: EmailService) {}

    async sendAllOverdueMails(): Promise<void> {
        const startOfToday = nullOutTimePart(new Date());
        const overdueEvents = await this.bookEventModel.aggregate([
            {
                $match: {
                    eventType: BookEventType.BORROW,
                    userNotified: false,
                    dueDate: { $lt: startOfToday }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $project: {
                    _id: 1,
                    author: "$book.author",
                    title: "$book.title",
                    userFullName: "$user.fullName",
                    eventType: 1,
                    targetEmail: "$user.email"
                }
            }
        ]);

        const bookEmailDtos = mapAllToClass(BookEmailDto, overdueEvents);
        return this.sendMailsAndSetUserNotified(bookEmailDtos);
    }

    private async sendMailsAndSetUserNotified(bookEmailDtos: BookEmailDto[]): Promise<void> {
        for (let dto of bookEmailDtos) {
            const sentSuccessfully = await this.emailService.sendEmail(dto);
            if (sentSuccessfully) {
                await this.bookEventModel.updateOne({ _id: dto._id }, { userNotified: true });
            }
        }
    }    

}