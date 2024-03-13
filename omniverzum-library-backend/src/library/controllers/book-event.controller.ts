import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BookEventService } from '../services/book-event.service';
import { BasicJwtGuard } from 'src/auth/guards/basic-jwt.guard';
import { Request } from 'express';
import { UserDto } from '../models/user/user.dto';
import { CreateBookEventDto } from '../models/book-event/create-book-event.dto';
import { BookEventType } from '../models/book-event/book-event-type';

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

}
