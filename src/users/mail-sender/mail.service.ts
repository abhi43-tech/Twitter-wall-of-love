import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendMailConfiguration {
  email: string;
  subject: string;
  text: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('EMAIL_HOST'),
      port: 465,
      secure: true,
      auth: {
        user: configService.get<string>('EMAIL'),
        pass: configService.get<string>('PASSWORD'),
      },
      from: {
        name: 'NestJs + React Emails Test App',
        address: 'Test App',
      },
    });
  }

  async sendMail({ email, subject, text }: SendMailConfiguration) {
    this.transporter.sendMail({
      to: email,
      subject,
      text,
    });
  }
}