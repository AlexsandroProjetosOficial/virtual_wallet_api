import Handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { readFileSync } from 'fs';
import { IMail } from 'types/mail/IMail';
import { ISendMail } from 'types/mail/ISendMail';

class MailTrapMailProvider implements IMail {
	private client: Transporter;

	constructor() {
		const transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "b850eef56f5ae5",
				pass: "afdd9494d0c1d1"
			}
		});

		this.client = transporter
	}
	
	async sendMail({ to, subject, variables, path }: ISendMail): Promise<void> {
		const templateFileContent = readFileSync(path).toString("utf-8");

		const templateParse = Handlebars.compile(templateFileContent);

		const templateHTML = templateParse(variables);

		const message = await this.client.sendMail({
			to,
			from: "My virtual wallet <noreplay@myvirtualwallet.com.br>",
			subject,
			html: templateHTML,
		});

		console.log("Message sent: %s", message.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
	}
}

export { MailTrapMailProvider };