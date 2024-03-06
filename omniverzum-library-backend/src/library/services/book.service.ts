import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Book } from "../schemas/book.schema";
import { CreateBookDto } from "../models/book/create-book.dto";
import { BookDto } from "../models/book/book.dto";
import { FilterBookDto } from "../models/book/filter-book.dto";
import { isString } from "class-validator";
import { mapAllToClass } from "src/utils/mappers";

@Injectable()
export class BookService {

    constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

    async createBook(bookData: CreateBookDto): Promise<void> {
        const newBook = new this.bookModel(bookData);
        await newBook.save();
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



}