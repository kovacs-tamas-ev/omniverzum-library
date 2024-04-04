import { Controller, Get } from "@nestjs/common";
import { EmailService } from "../services/email.service";
import { BookEmailDto } from "../models/book/book-email.dto";
import { BookEventType } from "../models/book-event/book-event-type";
import { log } from "console";

@Controller('email-test')
export class EmailTestController {

    constructor(private emailService: EmailService) {}

    @Get('send')
    async sendEmail(): Promise<void> {
        const borrowMail: BookEmailDto = {
            author: 'Martin Ucik',
            title: 'Integrál Párkapcsolat a gyakorlatban',
            eventType: BookEventType.BORROW,
            userFullName: 'Kovács Tamás',
            targetEmail: 'kovtamas1991@gmail.com'
        };
        const reserveMail: BookEmailDto = {
            author: 'Gánti Bence',
            title: 'A buddhizmus',
            eventType: BookEventType.RESERVE,
            userFullName: 'Kovács Tamás',
            targetEmail: 'kovtamas1991@gmail.com'
        }

        const borrowResult = await this.emailService.sendEmail(borrowMail);
        const reserveResult = await this.emailService.sendEmail(reserveMail);
        log(`borrowResult: ${borrowResult}`);
        log(`reserveResult: ${reserveResult}`);
    }

}