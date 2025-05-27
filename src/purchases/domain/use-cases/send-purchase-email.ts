import { IEmailService } from '../services/email-service';

export class SendPurchaseEmail {
    constructor(private readonly EmailService: IEmailService) {}

    async execute(userEmail: string, subject: string, body: string): Promise<boolean> {
        return this.EmailService.sendPurchaseConfirmationEmail(userEmail, subject, body);
    }
}
