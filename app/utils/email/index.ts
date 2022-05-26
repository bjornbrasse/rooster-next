import nodemailer from 'nodemailer';

export async function sendEmail(
  emails: string[],
  html: string,
  subject: string,
): Promise<{ success: true; message: string } | null> {
  console.log('SENDING MESSAGE!!!!', process.env.NODE_ENV);

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // const testAccount = await nodemailer.createTestAccount();

  // console.log('SENDING MESSAGE', testAccount.user);

  // create reusable transporter object using the default SMTP transport
  // const testTransporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // });

  // create reusable transporter object using the default SMTP transport
  const productionTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ACCOUNT, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  // const info = await transporter.sendMail({

  const transporter =
    process.env.NODE_ENV === 'development'
      ? // ? testTransporter
        productionTransporter
      : productionTransporter;

  const info = await transporter.sendMail({
    from: `"Rooster" <${
      process.env.NODE_ENV === 'development'
        ? 'no-reply@bra-c.nl'
        : process.env.EMAIL_ACCOUNT
    }>`,
    // to: emails.join(','),
    to: 'bpbrasse@bra-c.nl',
    subject,
    text: 'Hello world?', // plain text body
    html, // html body
  });

  console.log('Message sent: %s', info.messageId);

  // Preview only available when sending through an Ethereal account
  // if (process.env.NODE_ENV === 'development')
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return { success: true, message: html };
}
