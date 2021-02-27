import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";


class SendMailservice {

  private client: Transporter;
  constructor() {

    // constructor não permite o uso de async, por isso o uso de then
    // para reter a resposta
    nodemailer.createTestAccount()
      .then(
        account => {

          // Create a SMTP transporter object
          const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass
            }
          });

          this.client = transporter;
        });

  }



  async execute(to: string, subject: string, variables: object, path: string) {


    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreply@nps.com.br>"

    });

    console.log('Message sent: %s', message.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));



  }




}


export default new SendMailservice();