import { Body, Controller, Delete, Param, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { AdminJwtGuard } from "src/auth/guards/admin-jwt-guard";
import { BasicJwtGuard } from "src/auth/guards/basic-jwt.guard";
import { mapToClass } from "src/utils/mappers";
import { customValidationPipe } from "../exception-filters/custom-exception-factory";
import { BookDto } from "../models/book/book.dto";
import { FilterBookDto } from "../models/book/filter-book.dto";
import { BookService } from "../services/book.service";
import { BookWithEventDto } from "../models/book-event/book-with-event.dto";
import { BookWithEventFiltersDto } from "../models/book-event/book-with-event-filters.dto";
import { Request } from "express";
import { UserDto } from "../models/user/user.dto";

@Controller('book')
export class BookController {

    constructor(private bookService: BookService) {}

    @Post('create-or-update')
    @UseGuards(AdminJwtGuard)
    @UsePipes(customValidationPipe)
    async createOrUpdateBook(@Body() book: BookDto): Promise<void> {
        const plainBookData = mapToClass(BookDto, book);
        await this.bookService.createOrUpdateBook(plainBookData);
    }

    @Post('find')
    @UseGuards(BasicJwtGuard)
    async findBooks(@Body() filterData: FilterBookDto): Promise<BookDto[]> {
        const plainFilterData = mapToClass(FilterBookDto, filterData);
        return this.bookService.findBooks(plainFilterData);
    }

    @Delete(':id')
    @UseGuards(AdminJwtGuard)
    async deleteUser(@Param('id') id: string): Promise<void> {
        await this.bookService.deleteBook(id);
    }

    @Post('find-with-event')
    @UseGuards(BasicJwtGuard)
    async findBooksWithBasicEvent(@Req() request: Request, @Body() filters: BookWithEventFiltersDto): Promise<BookWithEventDto[]> {
        const tokenUserData = request.user! as UserDto;
        return await this.bookService.findBooksWithEvents(tokenUserData._id, filters);
    }



}