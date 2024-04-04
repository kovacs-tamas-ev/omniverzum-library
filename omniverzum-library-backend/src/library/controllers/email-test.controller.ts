import { Controller, Get } from "@nestjs/common";
import { BookEventAutomailService } from "../services/book-event-automail.service";

@Controller('email-test')
export class EmailTestController {

    constructor(private bookEventAutomailService: BookEventAutomailService) {}

    @Get('send')
    async sendEmail(): Promise<void> {
        this.bookEventAutomailService.sendAllOverdueMails();
    }

}