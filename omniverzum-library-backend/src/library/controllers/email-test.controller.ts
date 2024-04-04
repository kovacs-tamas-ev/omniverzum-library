import { Controller, Get, UseGuards } from "@nestjs/common";
import { BookEventAutomailService } from "../services/book-event-automail.service";
import { AdminJwtGuard } from "src/auth/guards/admin-jwt-guard";

@Controller('email')
export class EmailTestController {

    constructor(private bookEventAutomailService: BookEventAutomailService) {}

    @Get('send-overdue')
    @UseGuards(AdminJwtGuard)
    async sendOverdue(): Promise<void> {
        await this.bookEventAutomailService.sendAllOverdueMails();
    }

    @Get('send-reserve-available')
    @UseGuards(AdminJwtGuard)
    async sendReserveAvailable(): Promise<void> {
        await this.bookEventAutomailService.sendAllReserveAvailableMails();
    }

}