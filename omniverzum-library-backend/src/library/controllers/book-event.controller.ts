import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt-guard';
import { BasicJwtGuard } from 'src/auth/guards/basic-jwt.guard';
import { BookAndUserDto } from '../models/book-event/book-and-user.dto';
import { BookEventType } from '../models/book-event/book-event-type';
import { CreateBookEventDto } from '../models/book-event/create-book-event.dto';
import { UserDto } from '../models/user/user.dto';
import { BookEventService } from '../services/book-event.service';

@Controller('book-event')
export class BookEventController {

    constructor(private bookEventService: BookEventService) {}

    @Post('borrow/:bookId')
    @UseGuards(BasicJwtGuard)
    async borrowBook(@Req() request: Request, @Param('bookId') bookId: string): Promise<void> {
        const tokenUserData = request.user! as UserDto;
        const createBookEventDto: CreateBookEventDto = {
            bookId,
            userId: tokenUserData._id,
            eventType: BookEventType.BORROW
        };
        await this.bookEventService.createBookEvent(createBookEventDto);
    }

    @Post('reserve/:bookId')
    @UseGuards(BasicJwtGuard)
    async reserveBook(@Req() request: Request, @Param('bookId') bookId: string): Promise<void> {
        const tokenUserData = request.user! as UserDto;
        const createBookEventDto: CreateBookEventDto = {
            bookId,
            userId: tokenUserData._id,
            eventType: BookEventType.RESERVE
        };
        await this.bookEventService.createBookEvent(createBookEventDto);
    }

    @Post('return/:bookId')
    @UseGuards(BasicJwtGuard)
    async returnBook(@Req() request: Request, @Param('bookId') bookId: string): Promise<void> {
        const tokenUserData = request.user! as UserDto;
        await this.bookEventService.returnBook(tokenUserData._id, bookId);
    }

    @Post('cancel-reservation/:bookId')
    @UseGuards(BasicJwtGuard)
    async cancelReservation(@Req() request: Request, @Param('bookId') bookId: string): Promise<void> {
        const tokenUserData = request.user! as UserDto;
        await this.bookEventService.cancelReservation(tokenUserData._id, bookId);
    }

    @Post('return-for')
    @UseGuards(AdminJwtGuard)
    async returnBookFor(@Body() bookAndUserDto: BookAndUserDto): Promise<void> {
        await this.bookEventService.returnBook(bookAndUserDto.userId, bookAndUserDto.bookId);
    }

    @Post('cancel-reservation-for')
    @UseGuards(AdminJwtGuard)
    async cancelReservationFor(@Body() bookAndUserDto: BookAndUserDto): Promise<void> {
        await this.bookEventService.cancelReservation(bookAndUserDto.userId, bookAndUserDto.bookId);
    }

}
