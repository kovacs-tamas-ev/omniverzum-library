import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { BookEventType } from "../models/book-event/book-event-type";
import { BookEmailDto } from "../models/book/book-email.dto";

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService) {}

    async sendEmail(bookEmailDto: BookEmailDto): Promise<boolean> {
        const messageInfo = await this.mailerService.sendMail({
            to: bookEmailDto.targetEmail,
            from: 'kovacs.tamas.ev91@gmail.com',
            subject: bookEmailDto.eventType === BookEventType.BORROW
                ? 'Lejárt kölcsönzési határidő * Omniverzum Szabadegyetem'
                : 'A lefoglalt könyved újra elérhető * Omniverzum Szabadegyetem',
            html: this.createHtmlMessageFor(bookEmailDto)
        });

        const messageSuccessfullySent = messageInfo.accepted.length > 0;
        return messageSuccessfullySent;
    }

    private createHtmlMessageFor(bookEmailDto: BookEmailDto): string {
        if (bookEmailDto.eventType === BookEventType.BORROW) {
            return `Kedves ${bookEmailDto.userFullName},<br><br>
                    Az általad kivett <strong>${bookEmailDto.author}: ${bookEmailDto.title}</strong> című könyv kölcsönzési határideje lejárt.
                    Kérjük hozd vissza ezt a könyvet a könyvtárba.<br><br>
                    Köszönjük!<br><br></br>
                    Üdvözlettel,<br>
                    Omniverzum Csapat`;
        } else {
            return `Kedves ${bookEmailDto.userFullName},<br><br>
                    Az általad lefoglalt <strong>${bookEmailDto.author}: ${bookEmailDto.title}</strong> című könyv újra elérhető.<br>
                    A kölcsönzésért kérjük fáradj be a könyvtárba.<br><br><br>
                    Üdvözlettel,<br>
                    Omniverzum Csapat
                    `;
        }
    }

}