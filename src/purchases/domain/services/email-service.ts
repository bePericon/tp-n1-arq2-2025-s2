export interface IEmailService {
	sendPurchaseConfirmationEmail(
		to: string,
		subject: string,
		body: string
	): Promise<boolean>;
}
