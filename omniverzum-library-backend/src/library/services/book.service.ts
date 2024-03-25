import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isString } from "class-validator";
import mongoose, { FilterQuery, Model } from "mongoose";
import { mapAllToClass } from "src/utils/mappers";
import { validateObjectId } from "src/utils/object-utils";
import { BookWithEventFiltersDto } from "../models/book-event/book-with-event-filters.dto";
import { BookWithEventDto } from "../models/book-event/book-with-event.dto";
import { BookDto } from "../models/book/book.dto";
import { FilterBookDto } from "../models/book/filter-book.dto";
import { Book } from "../schemas/book.schema";
import { CreateBookDto } from "../models/book/create-book.dto";

@Injectable()
export class BookService {

    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

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


}