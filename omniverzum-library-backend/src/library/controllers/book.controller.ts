import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AdminJwtGuard } from "src/auth/guards/admin-jwt-guard";
import { BasicJwtGuard } from "src/auth/guards/basic-jwt.guard";
import { mapToClass } from "src/utils/mappers";
import { customValidationPipe } from "../exception-filters/custom-exception-factory";
import { BookDto } from "../models/book/book.dto";
import { CreateBookDto } from "../models/book/create-book.dto";
import { FilterBookDto } from "../models/book/filter-book.dto";
import { BookService } from "../services/book.service";

@Controller('book')
export class BookController {

    constructor(private bookService: BookService) {}

    @Post('create')
    @UseGuards(AdminJwtGuard)
    @UsePipes(customValidationPipe)
    async createBook(@Body() bookData: CreateBookDto): Promise<void> {
        const plainBookData = mapToClass(CreateBookDto, bookData);
        await this.bookService.createBook(plainBookData);
    }

    @Post('find')
    @UseGuards(BasicJwtGuard)
    async findBooks(@Body() filterData: FilterBookDto): Promise<BookDto[]> {
        const plainFilterData = mapToClass(FilterBookDto, filterData);
        return this.bookService.findBooks(plainFilterData);
    }

}