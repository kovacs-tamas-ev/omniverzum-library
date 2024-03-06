import { Body, Controller, Delete, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AdminJwtGuard } from "src/auth/guards/admin-jwt-guard";
import { BasicJwtGuard } from "src/auth/guards/basic-jwt.guard";
import { mapToClass } from "src/utils/mappers";
import { customValidationPipe } from "../exception-filters/custom-exception-factory";
import { BookDto } from "../models/book/book.dto";
import { FilterBookDto } from "../models/book/filter-book.dto";
import { BookService } from "../services/book.service";

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


}