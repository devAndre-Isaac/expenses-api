import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

export interface MailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}
export interface MailMessage {
  from: string;
  to: string;
  userName: string;
  description: string;
  value: string;
}

export default class EtherealMail {
  protected buildMailMessage(message: MailMessage) {
    return {
      from: message.from,
      to: message.to,
      subject: 'Despesa Cadastrada',
      html: `
      <h1>Olá ${message.userName},</h1>
       <h3>Foi realizado a inserção de uma nova despesa em sua conta.</h3>
       <p>Descrição: ${message.description}</p>
       <p>Valor: ${message.value}</p>`,
    };
  }
  protected transporter() {
    return {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      logger: true,
      tls: { rejectUnauthorized: false },
    };
  }

  public async send(message: MailMessage): Promise<void> {
    try {
      const transporter = nodemailer.createTransport(this.transporter());
      await transporter.sendMail(this.buildMailMessage(message));
    } catch (err) {
      throw new Error(err);
    }
  }
}
export const mail = new EtherealMail();
