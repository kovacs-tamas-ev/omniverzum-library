import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookEventDto } from '../models/book-event/create-book-event.dto';
import { BookEventService } from '../services/book-event.service';

@Controller('book-event')
export class BookEventController {

    constructor(private bookEventService: BookEventService) {}

    @Post('create')
    async create(@Body() createDto: CreateBookEventDto): Promise<void> {
        await this.bookEventService.createBookEvent(createDto);
    }

}
