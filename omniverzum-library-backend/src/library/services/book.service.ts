import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isString } from "class-validator";
import mongoose, { FilterQuery, Model } from "mongoose";
import { mapAllToClass, mapToClass } from "src/utils/mappers";
import { validateObjectId } from "src/utils/object-utils";
import { AdminBookWithEventFiltersDto } from "../models/book-event/admin-book-with-event-filters.dto";
import { BookWithEventFiltersDto } from "../models/book-event/book-with-event-filters.dto";
import { AdminBookEventDto, AdminBookWithEventDto, BasicBookEventDto, BookWithEventDto } from "../models/book-event/book-with-event.dto";
import { BookDto } from "../models/book/book.dto";
import { CreateBookDto } from "../models/book/create-book.dto";
import { FilterBookDto } from "../models/book/filter-book.dto";
import { BookEvent } from "../schemas/book-event.schema";
import { Book } from "../schemas/book.schema";
import { User } from "../schemas/user.schema";

@Injectable()
export class BookService {

    constructor(@InjectModel(Book.name) private bookModel: Model<Book>,
                @InjectModel(BookEvent.name) private bookEventModel: Model<BookEvent>,
                @InjectModel(User.name) private userModel: Model<User>) {}

    async createOrUpdateBook(book: BookDto | CreateBookDto): Promise<void> {
        if (book instanceof CreateBookDto) {
            const newBook = new this.bookModel(book);
            await newBook.save();    
        } else {
            const { _id, ...bookData } = book;
            if (_id) {
                await this.bookModel.findByIdAndUpdate(_id, bookData);
            } else {
                const newBook = new this.bookModel(bookData);
                await newBook.save();    
            }    
        }
    }

    async createMany(books: CreateBookDto[]): Promise<void> {
        await this.bookModel.insertMany(books);
    }

    async findBooks(filters: FilterBookDto): Promise<BookDto[]> {
        const filterQuery = {} as FilterQuery<Book>;

        if (filters && Object.keys(filters).length > 0) {
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined) {
                    filterQuery[key] = isString(filters[key])
                        ? { $regex: new RegExp(filters[key], 'i') }
                        : filters[key];
                }
            });
        }

        const resultDocs = await this.bookModel.find(filterQuery).exec();
        const resultObjects = resultDocs.map(doc => doc.toObject());
        return mapAllToClass(BookDto, resultObjects);
    }

    async deleteBook(id: string): Promise<void> {
        validateObjectId(id, 'Érvénytelen könyv azonosító');
        await this.bookModel.findByIdAndDelete(id);
    }

    async findBooksWithEvents(tokenUserId: string, filters: BookWithEventFiltersDto): Promise<BookWithEventDto[]> {
        const bookMatchQuery = {} as Record<string, any>;
        const evnetsMatchQuery = {} as Record<string, any>;

        const bookFilters = filters.bookFilters;
        if (bookFilters && Object.keys(bookFilters).length > 0) {
            Object.keys(bookFilters).forEach(key => {
                if (bookFilters[key] !== null && bookFilters[key] !== undefined) {
                    bookMatchQuery[key] = isString(bookFilters[key])
                        ? { $regex: new RegExp(bookFilters[key], 'i') }
                        : bookFilters[key];
                }
            });
        }


        if (filters && filters.myEvents !== null && filters.myEvents !== undefined) {
            const tokenUserIdAsObject = new mongoose.Types.ObjectId(tokenUserId);
            const userIdFilter = filters.myEvents ? tokenUserIdAsObject : { $ne: tokenUserIdAsObject };
            evnetsMatchQuery['events.userId'] = userIdFilter;
        }

        const result = await this.bookModel.aggregate([
            {
                $match: bookMatchQuery
            },
            {
              $lookup: {
                from: 'bookevents',
                localField: '_id',
                foreignField: 'bookId',
                as: 'events'
              }
            },
            {
                $match: evnetsMatchQuery
            }
          ]).exec();

        return mapAllToClass(BookWithEventDto, result);
    }

    async findBooksWithEventsForAdmin(filters: AdminBookWithEventFiltersDto): Promise<AdminBookWithEventDto[]> {
        const bookIds = await this.findBookIdsForAdminQuery(filters.userId);
        const booksWithEvents = await this.findBooksForAdminQuery(filters, bookIds);
        const adminBooksWithEvents = [];
        for (let bookWithEvent of booksWithEvents) {
            const adminBookWithEvent = await this.basicToAdminDto(bookWithEvent);
            adminBooksWithEvents.push(adminBookWithEvent);
        }

        return adminBooksWithEvents;
    }

    private async findBookIdsForAdminQuery(userIdStr?: string): Promise<mongoose.Types.ObjectId[]> {
        const filterQuery = {} as FilterQuery<BookEvent>;
        if (userIdStr) {
            const userId = new mongoose.Types.ObjectId(userIdStr);
            filterQuery.userId = userId;
        }

        const resultDocs = await this.bookEventModel.find(filterQuery).exec();
        const resultObjects = resultDocs.map(doc => doc.toObject());
        return resultObjects.map(bookEvent => bookEvent.bookId);
    }

    private async findBooksForAdminQuery(filters: AdminBookWithEventFiltersDto, bookIds: mongoose.Types.ObjectId[]): Promise<BookWithEventDto[]> {
        const bookMatchQuery = {} as Record<string, any>;

        const { userId, ...bookFilters } = filters;
        if (bookFilters && Object.keys(bookFilters).length > 0) {
            Object.keys(bookFilters).forEach(key => {
                if (bookFilters[key] !== null && bookFilters[key] !== undefined) {
                    bookMatchQuery[key] = isString(bookFilters[key])
                        ? { $regex: new RegExp(bookFilters[key], 'i') }
                        : bookFilters[key];
                }
            });
        }

        bookMatchQuery['_id'] = { $in: bookIds };

        const result = await this.bookModel.aggregate([
            {
                $match: bookMatchQuery
            },
            {
              $lookup: {
                from: 'bookevents',
                localField: '_id',
                foreignField: 'bookId',
                as: 'events'
              }
            }
          ]).exec();

        return mapAllToClass(BookWithEventDto, result);
    }

    private async basicToAdminDto(basic: BookWithEventDto): Promise<AdminBookWithEventDto> {
        const adminEvents = [];
        for (let event of basic.events) {
            const adminEvent = await this.basicToAdminBookEventDto(event);
            adminEvents.push(adminEvent);
        }

        const adminDto = {
            ...basic,
            events: adminEvents
        };

        return mapToClass(AdminBookWithEventDto, adminDto);
    }

    private async basicToAdminBookEventDto(basicDto: BasicBookEventDto): Promise<AdminBookEventDto> {
        const userDoc = await this.userModel.findById(new mongoose.Types.ObjectId(basicDto.userId));
        const adminBookEventDto = {
            ...basicDto,
            fullName: userDoc.fullName
        };

        return mapToClass(AdminBookEventDto, adminBookEventDto);
    }


}